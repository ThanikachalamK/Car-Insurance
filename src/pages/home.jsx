import React, { useEffect, useContext } from "react";
// import ProductCard from "../components/Product";
import {
  // ProductsStateContext,
  ProductsDispatchContext,
  // getProducts
} from "../contexts/products";
import { CommonStateContext } from "../contexts/common";

const Home = () => {
  // const { products, isLoading, isLoaded } = useContext(ProductsStateContext);
  // const { searchKeyword } = useContext(CommonStateContext);
  const dispatch = useContext(ProductsDispatchContext);
  /*
  const productsList =
    products &&
    products.filter((product) => {
      return (
        product.name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        !searchKeyword
      );
    });
   

  useEffect(() => {
    getProducts(dispatch);
  }, []);

  
  if (isLoading) {
    return (
      <div className="products-wrapper">
        <h1>Loading...</h1>
      </div>
    );
  }
  */
  return (
      <div>
        {/* {isLoaded && */}
          (
            <div _ngcontent-web-shell-c122="" class="grv-shr-lib-row checkered-row ng-star-inserted">
              <div _ngcontent-web-shell-c118="" class="grv-shr-lib-row ng-star-inserted">
                <div _ngcontent-web-shell-c118="" class="grv-shr-lib-col">
                  <a _ngcontent-web-shell-c118="" class="loginButton tile-content-button grv-shr-lib-button--text-directional-right" rel="" target="_self" data-initial-value="Get started" href="/auth"> 
                    Login  
                  </a>
                </div>
              </div>
              <div _ngcontent-web-shell-c122="" class="image-container content-col grv-shr-lib-col grv-shr-lib-col--sm-4 grv-shr-lib-col--lg-6 ng-star-inserted">
                <div _ngcontent-web-shell-c120="" class="lifestyle">
                  <img _ngcontent-web-shell-c120="" sharedlazyload="" src="https://ecm.capitalone.com/WCM/homepage/photos/checkered-component/checkered-component-animation-test/cap22092_creditwise-site-motion-test_olderwoman-1/rtablet.jpg" alt="" loading="lazy" />
                </div>
              </div>
              <div _ngcontent-web-shell-c122="" class="content-container content-col grv-shr-lib-col grv-shr-lib-col--sm-4 grv-shr-lib-col--lg-6 ng-star-inserted">
                <div _ngcontent-web-shell-c118="" class="tile-content-container grv-background--digital-gray-10 ng-star-inserted">
                    <div _ngcontent-web-shell-c118="" class="tile-content">
                      <div _ngcontent-web-shell-c118="" class="grv-shr-lib-row ng-star-inserted">
                        <div _ngcontent-web-shell-c118="" class="grv-shr-lib-col">
                          <p _ngcontent-web-shell-c118="" class="tile-content-eyebrow grv-shr-lib-text__heading--normal">Financial Wellness</p>
                        </div>
                      </div>
                      
                      <div _ngcontent-web-shell-c118="" class="grv-shr-lib-row">
                        <div _ngcontent-web-shell-c118="" class="grv-shr-lib-col">
                          <p _ngcontent-web-shell-c118="" class="tile-content-headline ng-star-inserted">Put CreditWise in your pocket</p>
                        </div>
                      </div>
                      <div _ngcontent-web-shell-c118="" class="grv-shr-lib-row ng-star-inserted">
                        <div _ngcontent-web-shell-c118="" class="grv-shr-lib-col">
                          <p _ngcontent-web-shell-c118="" class="tile-content-subheadline grv-shr-lib-text--normal">Get help building your credit score and financial future with our free app.</p>
                        </div>
                      </div>
                      
                      <div _ngcontent-web-shell-c118="" class="grv-shr-lib-row ng-star-inserted">
                        <div _ngcontent-web-shell-c118="" class="grv-shr-lib-col">
                          <a _ngcontent-web-shell-c118="" class="tile-content-button grv-shr-lib-button--text-directional-right" rel="" target="_self" data-initial-value="Get started" href="/types"> 
                            Get started  
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
              </div>
            </div>
          )
        {/* } */}
      </div>
  );
};

export default Home;
