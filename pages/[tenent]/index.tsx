import { getCookie, hasCookie, setCookie } from 'cookies-next';
import { GetServerSideProps } from 'next';
import { useEffect, useState } from 'react';
import { Banner } from '../../components/Banner';
import { Logo } from '../../components/Logo';
import { MenuCarrosel } from '../../components/Menucarrosel';
import { ProductItem } from '../../components/ProductItem';
import { SearchInput } from '../../components/Searchinput';
import { Sidebar } from '../../components/Sidebar';
import { useAppContext } from '../../contexts/app';
import { useAuthContext } from '../../contexts/auth';
import { Api } from '../../libs/useApi';
import styles from '../../styles/Home.module.css';
import { Product } from '../../types/Product';
import { Tenent } from '../../types/Tenent';
import { User } from '../../types/User';
import NoitemsIcon from '../../public/temp/notIntens.svg';
import { Complements } from '../../types/Complements';
import { CartButton } from '../../components/cart-button';
import { useRouter } from 'next/router';
import { CartItem } from '../../types/CartItem';
import { SectionTitle } from '../../components/section-title';
import { SectionOpenClose } from '../../components/section-openClose';

const Home = (data: Props) => {
  const { setToken, setUser } = useAuthContext();
  const { tenent, setTenent } = useAppContext();
  const router = useRouter();

  useEffect(() => {
    setTenent(data.tenent);
    setToken(data.token);
    if (data.user) setUser(data.user);
  }, [])

  const [products, setProducts] = useState<Product[]>(data.products);
  const [sidebarOpen, setsidebaropen] = useState(false);

  //Search

  const [filterProducts, setFilterProducts] = useState<Product[]>([]);

  const [searchText, setSearchtext] = useState('');

  useEffect(() => {
    let newFilterProducts: Product[] = []
    for (let product of data.products) {
      if (product.nome.toLocaleLowerCase().indexOf(searchText.toLocaleLowerCase()) > -1) {
        newFilterProducts.push(product);
      }
    }

    setFilterProducts(newFilterProducts);
  }, [searchText]);


  const handleSearch = (value: string) => setSearchtext(value);
  const handleCart = () => { router.push(`/${data.tenent.slug}/cart`) };

  //Resume
  const [cart, setCart] = useState<CartItem[]>(data.cart);

  const [subtotal, setSubtotal] = useState(0);
  useEffect(() => {
    let sub = 0;
    for (let i in cart) {
      sub += cart[i].product.preco * cart[i].qt;
    }

    setSubtotal(sub);
  }, [cart]);

  return (

    <div className={styles.container}>
      <CartButton color={data.tenent.mainColor} cart={data.cart} subtotal={subtotal} onClick={handleCart} />
      <div className={styles.headercontainer}>

        <header className={styles.header} style={{ backgroundColor: tenent?.background }}>
          <div className={styles.headerTop}>
            <Logo />

            <div className={styles.menubuttondiv}>

              <div className={styles.menuButton}
                onClick={() => setsidebaropen(true)}
              >

                <div className={styles.menuButtonLine}></div>
                <div className={styles.menuButtonLine}></div>
                <div className={styles.menuButtonLine}></div>

              </div>

              <Sidebar
                tenent={data.tenent}
                open={sidebarOpen}
                onclose={() => setsidebaropen(false)}
              />

            </div>
          </div>




          <div className={styles.headerBottom}>

            <SearchInput
              onSearch={handleSearch}
            />

          </div>
        </header>

      </div>
      <SectionOpenClose />

      {searchText &&
        <>

          <div className={styles.searchText}>
            Procurando por: <strong>{searchText}</strong>
          </div>

          {filterProducts.length > 0 &&
            <div className={styles.grid}>

              {filterProducts.map((item, index) => (
                <ProductItem
                  key={index}
                  data={item}
                  onClick={() => { }}
                />
              ))}

            </div>
          }

          {filterProducts.length === 0 &&

            <div className={styles.noProducts}>

              <NoitemsIcon></NoitemsIcon>
              <div className={styles.noProductsText}>
                Ops! Não há itens com esse nome.
              </div>
            </div>

          }
        </>
      }

      {!searchText &&

        <>
          <Banner />
          <MenuCarrosel />

          <SectionTitle title='Tradicionais' />
          <div className={styles.grid}>

            {products.map((item, index) => (
              <ProductItem
                onClick={() => { }}
                key={index}
                data={item}
              />
            ))}

          </div>
        </>

      }
    </div>

  );


}


export default Home;

type Props = {
  tenent: Tenent,
  products: Product[]
  token: string,
  user: User | null;
  complements: Complements[]
  cart: CartItem[];

}

export const getServerSideProps: GetServerSideProps = async (context) => {

  const { tenent: tenantSlug } = context.query
  const api = Api(tenantSlug as string);


  //Get Tenant
  const tenent = await api.getTenant();

  if (!tenent) {
    return { redirect: { destination: '/', permanent: false } }
  }

  //get Logged User 

  const token = getCookie('token', context);
  const user = await api.authorizeToken(token as string);

  //Get Products 

  const products = await api.getAllProducts();

  //get Cart Products
  const cartCookie = getCookie('cart', context);

  const cart = await api.getCartProduct(cartCookie as string);

  return {
    props: {
      tenent,
      products,
      user,
      token,
      cart
    }
  }


}