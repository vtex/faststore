# VTEX Integration

**FastStore** is a solution to develop high-performance frontends for ecommerce websites. There are, however, other pieces that compose a complete digital commerce experience. At **VTEX**, some of these core features are:

- **Checkout** - receives the shopper's information necessary to process an order.
- **OrderPlaced** - displays a successful message right after the checkout process is completed.
- **Login** - handles user login in a store.
- **MyAccount** - allows customers to manage their orders and personal data (e.g., profile info, password, addresses, and credit cards) on a single page. 

Therefore, to provide shoppers with a full checkout and post-purchase experience, you, as a developer, must guarantee the integration between your FastStore project and VTEX solutions. In the following, we provide you with a go-live checklist which you can use to keep track of the whole integration process.

## Go-live checklist

### Storefront development

<input type="checkbox" id="1" name="1"/>
<label for="1"> Develop your storefront with FastStore. <i>See <a href="/tutorials/gatsby-overview">this tutorial</a> for more info.</i></label><br/>

### VTEX integration

<input type="checkbox" id="2" name="2"/>
<label for="2"> Configure your website's domain and subdomain. <i>See <a href="/how-to-guides/platform-integration/vtex/hosting-a-faststore-vtex-website">this doc</a> for more info.</i></label><br/>    
<input type="checkbox" id="3" name="3"/>
<label for="3"> Integrate the VTEX Login with your FastStore project. <i>See <a href="/how-to-guides/platform-integration/vtex/integrating-the-vtex-login">this doc</a> for more info.</i></label><br/> 
    <ul className="pl-5">
        <li>Open your store website and log into it. Check if you are indeed logged in and that you are redirected to your store's Home Page after logging in.</li>
    </ul>
<input type="checkbox" id="4" name="4"/>
<label for="4"> Clone, edit, and install the <a href="https://github.com/vtex/storeframework.store-theme/"><code>faststore-vtex-integrations</code></a> app on your VTEX account. <i>See <a href="/how-to-guides/platform-integration/vtex/integrating-vtex-orderplaced-myaccount">this doc</a> for more info.</i></label><br/> 
    <ul className="pl-5">
        <li>Open your store website and add an item to the shopping cart. Then, go to the Checkout and check if:
            <ol className="pl-5">
                <li>The products added to your shopping cart are the same presented in the Checkout.</li>
                <li>You are redirected to the Order Placed page once you complete the Checkout flow.</li>
            </ol>
        </li>
        <li>Open your store website and click on <strong>My Orders</strong>. Check if you are redirected to the MyAccount page.</li>
    </ul>
<input type="checkbox" id="5" name="5"/>
<label for="5"> Adjust the Header links with the appropriate links to the Checkout and MyAccount pages.<i>See <a href="/">this doc</a> for more info (Coming Soon.)</i></label><br/> 
<input type="checkbox" id="6" name="6"/>
<label for="6"> Test your website links to pages being rendered in a subdomain, such as the Login, Checkout, My Account, and Order Placed pages.</label><br/> 

### SSL configuration

<input type="checkbox" id="7" name="7"/>
<label for="7"> Check if all pages of your store have the correct SSL certificate configured.</label><br/> 

### Testing and performance

<input type="checkbox" id="8" name="8"/>
<label for="8"> Run Lighthouse tests on your store's Home Page, Product Listing Page (PLP), Product Details Page (PDP), and custom pages to ensure that you are going live with great performance.</label><br/> 
<input type="checkbox" id="9" name="9"/>
<label for="9"> If you already have a live store, set up an A/B test to validate which version of your website is the best for your business needs.</label><br/> 

