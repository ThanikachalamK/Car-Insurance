import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { CartDispatchContext, addToCart } from "../contexts/cart";

const ProductCard = ({ data }) => {
  const [isAdded, setIsAdded] = useState(false);
  const history = useNavigate();
  const [qty, setQty] = useState(1);
  const dispatch = useContext(CartDispatchContext);
  const { image, name, price, id, stock, category } = data;

  const handleAddToCart = (type = false) => {
    const product = { ...data, quantity: qty };
    if (type) {
      history('/lists');
    } else {
      addToCart(dispatch, product);
      setIsAdded(true);
      setTimeout(() => {
        setIsAdded(false);
      }, 3500);
    }
  };

  /*
  let incNum =()=>{
    if(qty<10)
    {
      setQty(Number(qty)+1);
    }
  };
  let decNum = () => {
     if(qty>1)
     {
      setQty(qty - 1);
     }
  }
 let handleChange = (e)=>{
  setQty(e.target.value);
  }
  */

  return (
    <div className="product">
      <div className="product-image">
      {(category === 'Cars') ? <img 
          src= {image} 
          alt={name} />
        : <img 
          src={image} 
          alt={name} />}
      </div>
      <h4 className="product-name">Item - {id}</h4>
      {price && <p className="product-price">{price}</p>}
      {(category === 'Cars') && <p className="product-category">{name}</p>}
      {/*<div className="stepper-input">
        <a href="#" className="decrement" onClick={decNum}>–</a>
        <input type="number" className="quantity" value={qty} onChange={handleChange} />
        <a href="#" className="increment" onClick={incNum}>+</a>
      </div> */}
      <div className="product-action">
        {price ? <button
          className={!isAdded ? "" : "added"}
          type="button"
          onClick={() => handleAddToCart(false)}
        >
          {!isAdded ? "ADD TO CART" : "✔ ADDED"}
        </button> : <button
          className={!isAdded ? "" : "added"}
          type="button"
          onClick={() => handleAddToCart(true)}
        >
          {!isAdded ? "Select" : "✔ Selected"}
        </button>
        }
      </div>
    </div>
  );
};

export default ProductCard;
