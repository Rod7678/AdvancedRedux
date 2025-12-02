import { useEffect } from 'react';
import Cart from './components/Cart/Cart';
import Layout from './components/Layout/Layout';
import Products from './components/Shop/Products';
import { useDispatch, useSelector } from 'react-redux';
import { uiActions } from './components/store/ui-slice';
import Notification from './components/UI/Notification';

let isInitial = true;

function App() {
  const showCart = useSelector(state => state.ui.cartIsVisible);
  const cart = useSelector(state => state.cart);
  const notification = useSelector(state => state.ui.notification)
  const dispatch = useDispatch();

  useEffect(() => {
    const sendCartData = async () => {
      dispatch(uiActions.showNotification({
        status: 'pending',
        title: 'sending..',
        message: 'sending data wait '
      }));
      const response = await fetch('https://react-http-1b89e-default-rtdb.firebaseio.com/cart.json', {
        method: 'PUT',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cart),
      });

      if(!response){
        throw new Error('sending cart data failed');
      }

    dispatch(uiActions.showNotification({
        status: 'success',
        title: 'Success',
        message: 'sending data wait '
      }));
    }

    if(isInitial) {
      isInitial = false;
      return;
    }

    sendCartData().catch(error =>{
      dispatch(uiActions.showNotification({
        status: 'error',
        title: 'Error..',
        message: 'sending data wait '
      }));
    });
  }, [cart, dispatch])
  return (
    <>
    {notification && <Notification status={notification.status} title={notification.title} message={notification.message}/>}
    <Layout>
      {showCart && <Cart />}
      <Products />
    </Layout>
    </>
  );
}

export default App;
