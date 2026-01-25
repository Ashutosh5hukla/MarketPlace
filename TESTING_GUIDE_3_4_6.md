# Testing Guide for Features 3, 4, and 6

## 🧪 Quick Test Scenarios

### Feature 3: Seller Product Filtering

#### Test as Seller:
1. **Login as a seller account**
2. Navigate to `/products` page
3. ✅ **Expected:** See only YOUR products
4. ✅ **Expected:** Header shows "My Products"
5. ✅ **Expected:** Description text: "Manage your product listings and track your inventory"

#### Test as Buyer:
1. **Login as a buyer/customer account**
2. Navigate to `/products` page  
3. ✅ **Expected:** See ALL products from all sellers
4. ✅ **Expected:** Header shows "All Products"

#### Backend Verification:
```bash
# Check browser Network tab
# Request to: GET /api/products?sellerId=<user-id>
# Should only return products where seller field matches the user ID
```

---

### Feature 4: Multiple Image Upload

#### Create Product with Images:

1. **Go to Create Product page** (`/create-product`)
2. Fill in basic product details (title, price, category, etc.)
3. **Add Image URLs** (one at a time):
   - Example URLs you can use for testing:
     - `https://images.unsplash.com/photo-1523275335684-37898b6baf30`
     - `https://images.unsplash.com/photo-1505740420928-5e560c06d30e`
     - `https://images.unsplash.com/photo-1572635196237-14b3f281503f`

4. **Test Main Image Selection:**
   - ✅ First image should have ⭐ star badge automatically
   - ✅ Click on second image → star moves to that image
   - ✅ Click on third image → star moves to that image
   - ✅ Border should highlight the selected main image (purple border)

5. **Submit the product**

#### View Product Images:

##### On Shop Page (`/shop`):
- ✅ Product card should display the MAIN image (not icon)
- ✅ Image should have hover zoom effect
- ✅ Condition badge in top-left corner
- ✅ Category badge in top-right corner

##### On Product List Page (`/products`):
- **Grid View:**
  - ✅ Main image displayed at top of card
  - ✅ Image size: 48rem height
  
- **List View:**
  - ✅ Main image displayed as 32x32 square on left
  - ✅ Content flows next to image

##### In Product Details Modal:
1. **Click "View Details" on any product with multiple images**
2. ✅ **Expected:** Large image gallery at top
3. ✅ **Expected:** Left/Right arrow buttons (visible on hover)
4. ✅ **Expected:** Dot indicators at bottom
5. ✅ **Expected:** Thumbnail strip below main image
6. ✅ **Test Navigation:**
   - Click right arrow → moves to next image
   - Click left arrow → moves to previous image
   - Click on thumbnail → jumps to that image
   - Click on dot indicator → jumps to that image

---

### Feature 6: Damage Condition

#### Create Product with Damage:

1. **Go to Create Product page**
2. Fill in basic details
3. **Scroll to "Damage Condition" section** (orange box with warning icon)
4. **Test Different Levels:**

   **Level: None (Default)**
   - ✅ Description textarea should be HIDDEN

   **Level: Minor**
   - ✅ Description textarea appears
   - ✅ Enter: "Small scratch on corner, barely visible"
   - ✅ Orange warning styling maintained

   **Level: Moderate**
   - ✅ Enter: "Some wear and tear, minor dents on back"

   **Level: Heavy**
   - ✅ Enter: "Significant damage, broken clasp, needs repair"

5. **Submit the product**

#### View Damage Information:

##### In Product Details Modal:
1. **Open product with damage level != "None"**
2. ✅ **Expected:** Orange alert box appears after basic details
3. ✅ **Expected:** Shows: "Damage Condition: [Level]"
4. ✅ **Expected:** Description text below heading
5. ✅ **Expected:** AlertTriangle icon on left

6. **Open product with damage level = "None"**
7. ✅ **Expected:** Damage section is COMPLETELY HIDDEN

---

## 🎯 Combined Feature Test

### Full Workflow Test:

1. **Login as Seller**
2. **Create New Product:**
   ```
   Title: Vintage Camera
   Price: 15000
   Category: Electronics
   Condition: Good
   
   Images:
   - https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f
   - https://images.unsplash.com/photo-1510127034890-ba27508e9f1c
   - https://images.unsplash.com/photo-1606982024-cce7e9370d34
   
   Set 2nd image as main (click on it)
   
   Damage Condition:
   - Level: Minor
   - Description: "Small scratch on lens cap"
   
   Video URL: https://www.youtube.com/watch?v=dQw4w9WgXcQ
   ```

3. **Submit → Should redirect to /shop**

4. **Navigate to /products (Product List)**
   - ✅ See ONLY your products
   - ✅ See "My Products" header
   - ✅ See the new product with 2nd image as main

5. **Click "View Details"**
   - ✅ Image gallery shows all 3 images
   - ✅ 2nd image is displayed first (because it's main)
   - ✅ Can navigate through images
   - ✅ Video section appears with embedded YouTube
   - ✅ Damage condition section shows orange alert

6. **Logout and login as Buyer**
7. **Navigate to /shop**
   - ✅ See the new product in grid
   - ✅ Main image (2nd one) is displayed

8. **Navigate to /products**
   - ✅ See ALL products (not just yours)
   - ✅ Header shows "All Products"

---

## 🐛 Common Issues to Check

### Images Not Showing:
- Check browser console for CORS errors
- Verify image URLs are accessible
- Check if `mainImage` property exists in API response
- Verify virtual property is included in query (use `.populate()` or `toJSON: { virtuals: true }`)

### Seller Filter Not Working:
- Check JWT token is valid
- Verify user role is "seller" or "admin"
- Check Network tab for `sellerId` parameter
- Verify MongoDB query in controller

### Damage Condition Not Saving:
- Check form state before submit
- Verify nested object structure
- Check MongoDB document structure
- Ensure enum values match exactly

### Video Not Embedding:
- Verify URL is valid YouTube or Vimeo link
- Check iframe `src` attribute
- Ensure `getVideoEmbedUrl()` function extracts ID correctly

---

## 📊 Database Verification

### Check Product Document:

Using MongoDB Compass or mongo shell:

```javascript
db.products.findOne({ title: "Vintage Camera" })

// Expected structure:
{
  images: [
    { url: "...", isMain: false },
    { url: "...", isMain: true },  // 2nd image
    { url: "...", isMain: false }
  ],
  videoUrl: "https://www.youtube.com/watch?v=...",
  damageCondition: {
    level: "Minor",
    description: "Small scratch on lens cap"
  },
  seller: ObjectId("..."),
  // ... other fields
}
```

### Check Seller Filtering:

```javascript
// Get all products for a specific seller
db.products.find({ seller: ObjectId("USER_ID") })

// Should match exactly what appears on /products page for that seller
```

---

## 🎨 Visual Checklist

### CreateProduct Page:
- [ ] Image preview grid (max 5 images)
- [ ] Star badge on main image (gold color)
- [ ] Purple border on main image
- [ ] Click to change main image works
- [ ] Orange damage condition box
- [ ] Textarea appears/disappears based on level
- [ ] Video URL input field

### Shop Page:
- [ ] Product cards show main image
- [ ] Hover zoom effect works
- [ ] Condition badge (top-left)
- [ ] Category badge (top-right)
- [ ] Fallback icon if no images

### ProductList Page:
- [ ] Grid view shows images properly
- [ ] List view shows images on left side
- [ ] "My Products" header for sellers
- [ ] Grid/List toggle works

### ProductDetailsModal:
- [ ] Large image gallery at top
- [ ] Navigation arrows (visible on hover)
- [ ] Dot indicators at bottom
- [ ] Thumbnail strip below
- [ ] Video section (if videoUrl exists)
- [ ] Damage condition section (if level != "None")
- [ ] All sections properly spaced

---

## ⚡ Performance Testing

1. **Load time:** Product List with 20+ products should load smoothly
2. **Image loading:** Use browser DevTools Network tab to check image sizes
3. **Navigation:** Image gallery navigation should be instant (no lag)
4. **Filtering:** Seller filter should apply on backend (check Network tab)

---

## 🔄 Regression Testing

Ensure old features still work:
- [ ] Login/Register functionality
- [ ] Create product without images (should work)
- [ ] Create product without damage info (should default to "None")
- [ ] Buy Now functionality in modal
- [ ] Search and category filters on Shop page
- [ ] Pagination on Product List

---

*Use this guide to systematically test all three features!*
