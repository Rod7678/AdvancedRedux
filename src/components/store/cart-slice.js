import { createSlice } from "@reduxjs/toolkit";
import { uiActions } from "./ui-slice";

const cartSlice =  createSlice({
    name: 'cart',
    initialState: {
        items: [],
        totalQuantity: 0,
    },
    reducers: {
        replaceCart(state, action){
            state.totalQuantity = action.payload.totalQuantity;
            state.items = action.payload.items
        },
        addItemToCart(state, action){
            const newItem = action.payload;
            const existingItem = state.items.find(item =>item.id === newItem.id);
            state.totalQuantity++;
            if(!existingItem){
                state.items.push({
                    id: newItem.id, 
                    price: newItem.price, 
                    quantity: 1, 
                    totalPrice: newItem.price, 
                    name: newItem.title
                });
    
            } else {
                existingItem.quantity = existingItem.quantity +1;
                existingItem.totalPrice = existingItem.totalPrice + newItem.price;
            }
        },
        removeItemFromCart(state, action){
            const id = action.payload;
            state.totalQuantity--
            const existingItem = state.items.find(item => item.id === id);
            if(existingItem.quantity === 1){
                state.items = state.items.filter(item => item.id !== id);
            }else{
                existingItem.quantity--;
                existingItem.totalPrice = existingItem.totalPrice - existingItem.price;
            }
        }
    }
});

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
                body: JSON.stringify(cart),
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


export const cartSliceActions = cartSlice.actions;
export default cartSlice;