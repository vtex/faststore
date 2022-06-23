# VTEX Integration

**FastStore** is a solution to develop high-performance frontends for ecommerce websites. There are, however, other pieces that compose a complete digital commerce experience. At **VTEX**, some of these core features are:

- **Checkout** - receives the shopper's information necessary to process an order.
- **OrderPlaced** - displays a successful message right after the checkout process is completed.
- **Login** - handles user login in a store.
- **MyAccount** - allows customers to manage their orders and personal data (e.g., profile info, password, addresses, and credit cards) on a single page.

Therefore, to provide shoppers with a full checkout and post-purchase experience, you, as a developer, must guarantee the integration between your FastStore project and VTEX solutions. In the following, we provide you with a go-live checklist which you can use to keep track of the whole integration process.

## Go-live checklist

### Storefront development

<div className="w-5/6 m-auto border p-5 rounded">
  <div className="checklistList">
    <div className="flex items-center">
      &#8203;
      <input type="checkbox" id="1" />
    </div>
    <label for="1"> Develop your storefront with FastStore.</label>
  </div>
  <div className="checklistDetails">
      <i>Please refer to <a href="/tutorials/gatsby-overview">this tutorial</a> for more information.</i>
  </div>
</div>

### VTEX integration

<div className="w-5/6 m-auto border p-5 rounded">
  
  <div className="checklistList">
    <div className="flex items-center">
      &#8203;
      <input type="checkbox" id="2"/>
    </div>
    <label for="2"> Configure your website's domain and subdomain.</label>
  </div>
  <div className="checklistDetails"><i>Please refer to <a href="/how-to-guides/platform-integration/vtex/hosting-a-faststore-vtex-website">this doc</a> for more information.</i></div>

  <div className="checklistList">
    <div className="flex items-center">
      &#8203;
      <input type="checkbox" id="3"/>
    </div>
    <label for="3"> Integrate the VTEX Login with your FastStore project.</label><br />
  </div>
  <div className="checklistDetails"><i>Please refer to <a href="/how-to-guides/platform-integration/vtex/integrating-the-vtex-login">this doc</a> for more information.</i></div>
  <div className="checklistDetails">Open your store website and log in to it. After logging in, verify if you are indeed logged in and are being redirected to your store's Home Page.</div>
    <div className="checklistList">
      <div className="flex items-center">
      &#8203;
      <input type="checkbox" id="4"/>
    </div>
    <label for="4"> Adjust the header by replacing the links to the Checkout and MyAccount pages with the proper paths.</label>
  </div>

  <div className="checklistDetails"><i>Please refer to <a href="/how-to-guides/platform-integration/vtex/integrating-vtex-checkout">this doc</a> for more information.</i></div>
    <div className="checklistList">
      <div className="flex items-center">
      &#8203;
      <input type="checkbox" id="5" />
    </div>
    <label for="5"> Clone, edit, and install the <a href="https://github.com/vtex/faststore-vtex-integrations/"><code>faststore-vtex-integrations</code></a> app on your VTEX account.</label>
  </div>
  <div className="checklistDetails"><i>Please refer to <a href="/how-to-guides/platform-integration/vtex/integrating-vtex-orderplaced-myaccount">this doc</a> for more information.</i></div>
  <div className="checklistDetails">
    <ul>
      <li>Add an item to the shopping cart on your store's website. Then proceed to <strong>checkout</strong> and check if the products added to your shopping cart are the same as those shown in the checkout. Complete the checkout process and check if you are redirected to the <strong>Order Placed</strong> page.</li>
      <li>Open your store website and click on <strong>My Orders</strong>. Check if you are redirected to the MyAccount page.</li>
    </ul>
  </div>
    <div className="checklistList">
      <div className="flex items-center">
      &#8203;
      <input type="checkbox" id="6" />
    </div>
    <label for="6"> Test your website links to pages being rendered in the secure subdomain, such as the Login, Checkout, My Account, and Order Placed pages.</label>
  </div>
</div>

### SSL configuration

<div className="w-5/6 m-auto border p-5 rounded">
  <div className="checklistList">
    <div className="flex items-center">
    &#8203;
    <input type="checkbox" id="7" />
    </div>
    <label for="7"> Check if all pages of your store have the correct SSL certificate configured.</label>
  </div>
</div>

### Testing and performance

<div className="w-5/6 m-auto border p-5 rounded">
  <div className="checklistList">
      <div className="flex items-center">
        &#8203;
        <input type="checkbox" id="8" />
      </div>
    <label for="8"> Run <strong>Lighthouse</strong> audits on your store's Home Page, Product Listing Page (PLP), Product Details Page (PDP), and custom pages to guarantee you are going live with great performance.</label> 
  </div>

  <div className="checklistList">
    <div className="flex items-center">
      &#8203;
      <input type="checkbox" id="9" />
    </div>
    <label for="9"> If you already have a live store, <strong>set up an A/B test</strong> to validate which version of your website is the best for your business needs.</label>
  </div>
</div>
