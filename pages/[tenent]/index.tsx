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
import { Category } from '../../types/Category';
import { SidebarMenuitem } from '../../components/SidebarMenuitem';
import { Footer } from '../../components/Footer';
import { Banner as Baner } from '../../types/Banner';

const Home = (data: Props) => {
  const { setToken, setUser } = useAuthContext();
  const { tenent, setTenent } = useAppContext();
  const router = useRouter();

  useEffect(() => {
    setTenent(data.tenent);
    setToken(data.token);
    if (data.user) setUser(data.user);
  }, [])

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
    <>
      <div className={styles.container}>
        <CartButton color={data.tenent.main_color} cart={data.cart} subtotal={subtotal} onClick={handleCart} />
        <div className={styles.headercontainer}>
          <header className={styles.header}>
            <div className={styles.headerContent}>
              <div className={styles.headerTop}>
                <Logo />
                <div className={styles.menuArea}>
                  <nav className={styles.desktopMenu}>
                    {data.user ? (
                      <div className={styles.userInfo}>
                        <strong>{data.user.nome}</strong>
                      </div>
                    ) : (
                      <div
                        className={styles.loginButton}
                        onClick={() => router.push(`/${data.tenent.slug}/login`)}
                      >
                        Fazer Login
                      </div>
                    )}
                    <SidebarMenuitem
                      icon='cardapio'
                      label='Cardápio'
                      onClick={() => router.push(`/${data.tenent.slug}`)}
                    />
                    <SidebarMenuitem
                      icon='favorito'
                      label='Favoritos'
                      onClick={() => { }}
                    />
                    <SidebarMenuitem
                      icon='sacola'
                      label='Sacola'
                      onClick={() => router.push(`/${data.tenent.slug}/cart`)}
                    />
                    {data.user && (
                      <SidebarMenuitem
                        icon='sair'
                        label='Sair'
                        onClick={() => {
                          setToken('');
                        }}
                      />
                    )}
                  </nav>
                  <div className={styles.menuButton} onClick={() => setsidebaropen(true)}>
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
                <SearchInput onSearch={handleSearch} />
              </div>
            </div>
          </header>
        </div>

        <div className={styles.mainContent}>
          <SectionOpenClose
            tenant={data.tenent}
            userLoggedIn={data.user}
            openTime='00:00'
            closeTime='abre terça ás 20h'
          />

          {searchText && (
            <>
              <div className={styles.searchText}>
                Procurando por: <strong>{searchText}</strong>
              </div>

              {filterProducts.length > 0 && (
                <div className={styles.grid}>
                  {filterProducts.map((item, index) => (
                    <ProductItem
                      key={index}
                      data={item}
                      onClick={() => { }}
                    />
                  ))}
                </div>
              )}

              {filterProducts.length === 0 && (
                <div className={styles.noProducts}>
                  <NoitemsIcon />
                  <div className={styles.noProductsText}>
                    Ops! Não há itens com esse nome.
                  </div>
                </div>
              )}
            </>
          )}

          {!searchText && (
            <>
              <Banner data={data.banners} />
              <MenuCarrosel categories={data.categories} products={data.products} />
            </>
          )}
        </div>

        <Footer />
      </div>
    </>
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
  categories: Category[]
  banners: Baner[]

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

  //Get Categories

  const categories = await api.getAllCategorys();

  //get Cart Products
  const cartCookie = getCookie('cart', context);

  //get Banners
  const banners = await api.getBanners();

  const cart = await api.getCartProduct(cartCookie as string);

  return {
    props: {
      tenent,
      products,
      user,
      token,
      cart,
      categories,
      banners
    }
  }


}