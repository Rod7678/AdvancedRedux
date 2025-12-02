import { uiActions } from "./ui-slice";
import { cartSliceActions } from "./cart-slice";


export const fetchCartData = () => {
    return async (dispatch) =>{
        const fetchData = async () =>{
            const response = await fetch('https://react-http-1b89e-default-rtdb.firebaseio.com/cart.json');

            if(!response.ok) {
                throw new Error('Could not fetch cart data')
            }

            const data = await response.json();

            return data;
        }

        try {
            const cartData = await fetchData();
            // console.log(cartData.totalQu antity)
            dispatch(cartSliceActions.replaceCart({
                items: cartData.items || [],
                totalQuantity: cartData.totalQuantity
            }));
        } catch (error) {
            dispatch(
                uiActions.showNotification({
                    status: 'error',
                    title: 'Error',
                    message: 'Fetching cart data failed'
                })
            )
        }
    }   
}

export const sendCartData = (cart) => {
    return async (dispatch) => {
        dispatch(
            uiActions.showNotification({
                status: 'pending',
                title: 'sending..',
                message: 'sending data wait '
            })
        );

        const sendRequest = async () =>{
            const response = await fetch('https://react-http-1b89e-default-rtdb.firebaseio.com/cart.json', {
                method: 'PUT',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    items: cart.items,
                    totalQuantity: cart.totalQuantity,
                }),
            });
            
            if(!response){
                throw new Error('sending cart data failed');
            }
        };

        try {
            await sendRequest();
            dispatch(uiActions.showNotification({
                status: 'success',
                title: 'Success',
                message: 'sending data wait '
            }));
        } catch (error) {
            dispatch(uiActions.showNotification({
                status: 'error',
                title: 'Error..',
                message: 'sending data wait '
            }));
        }
    }
}
