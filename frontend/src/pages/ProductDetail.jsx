import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate, useSearchParams } from "react-router-dom";
import bannerService from "../services/bannerService";
import { extractCampaignDiscount } from "../utils/discountUtils";
import { ArrowLeft } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { getImageUrl } from "../utils/imageUrl";
import TopHeader from "../components/layout/TopHeader";
import MainHeader from "../components/layout/MainHeader";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import Newsletter from "../components/home/Newsletter";
import ProductCard from "../components/common/ProductCard";
import ProductDetailGallery from "../components/product/ProductDetailGallery";
import ProductDetailInfo from "../components/product/ProductDetailInfo";
import ProductDetailTabs from "../components/product/ProductDetailTabs";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, getItemCartQuantity, getRemainingStock } = useCart();

  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [activeTab, setActiveTab] = useState("descriptions");
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loadingRelated, setLoadingRelated] = useState(true);

  const inCartQty = product ? getItemCartQuantity(product._id) : 0;
  const remainingStock = product ? getRemainingStock(product) : 0;
  const { isInWishlist, toggleWishlist } = useWishlist();
  const isWishlisted = product ? isInWishlist(product._id) : false;

  const [searchParams] = useSearchParams();
  const campaignId = searchParams.get("campaign");
  const [activeCampaign, setActiveCampaign] = useState(null);

  // Fetch campaign if campaignId query param exists
  useEffect(() => {
    if (!campaignId) return;
    let isMounted = true;
    bannerService
      .getBannerById(campaignId)
      .then((b) => {
        if (isMounted && b) setActiveCampaign(b);
      })
      .catch((e) => console.warn("Could not load campaign in ProductDetail:", e));
    return () => {
      isMounted = false;
    };
  }, [campaignId]);

  // Fetch product detail
  useEffect(() => {
    const fetchProductDetail = async () => {
      try {
        setLoading(true);
        const res = await fetch(`http://localhost:5000/api/products/${id}`);
        if (!res.ok) throw new Error("Failed to fetch product");
        const data = await res.json();
        const prod = data.product || data;
        setProduct(prod);
        if (prod?.images && prod.images.length > 0) {
          setSelectedImage(prod.images[0]);
        }
      } catch (err) {
        console.error("Error fetching product detail:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetail();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [id]);

  // Fetch related products
  useEffect(() => {
    if (!product) return;
    const fetchRelated = async () => {
      try {
        setLoadingRelated(true);
        const res = await fetch("http://localhost:5000/api/products");
        if (res.ok) {
          const allProds = await res.json();
          const targetCategory = product.category?._id || product.category;
          const filtered = allProds
            .filter((p) => {
              if (p._id === product._id) return false;
              const pCat = p.category?._id || p.category;
              return pCat === targetCategory;
            })
            .slice(0, 4);
          setRelatedProducts(filtered.length > 0 ? filtered : allProds.slice(0, 4));
        }
      } catch (e) {
        console.warn("Could not fetch related products:", e);
      } finally {
        setLoadingRelated(false);
      }
    };

    fetchRelated();
  }, [product]);

  // Pricing calculations
  const productDiscount = Number(product?.discount || 0);
  const campaignDiscount = extractCampaignDiscount(activeCampaign);
  const effectiveDiscount = Math.max(productDiscount, campaignDiscount);
  const hasDiscount = effectiveDiscount > 0;

  const originalPrice = Number(product?.price || 0);
  const finalPrice = hasDiscount
    ? (originalPrice - (originalPrice * effectiveDiscount) / 100).toFixed(2)
    : originalPrice.toFixed(2);

  const handleDecreaseQuantity = () => {
    setQuantity((prev) => {
      const num = Number(prev) || 1;
      return num > 1 ? num - 1 : 1;
    });
  };

  const handleIncreaseQuantity = () => {
    setQuantity((prev) => {
      const num = Number(prev) || 0;
      return remainingStock > 0 && num < remainingStock ? num + 1 : num;
    });
  };

  const handleQuantityInputChange = (e) => {
    const val = e.target.value.replace(/[^0-9]/g, "");
    setQuantity(val);
  };

  const handleQuantityBlur = () => {
    let parsed = parseInt(quantity, 10);
    if (isNaN(parsed) || parsed < 1) parsed = 1;
    if (remainingStock > 0 && parsed > remainingStock) parsed = remainingStock;
    setQuantity(parsed);
  };

  const handleAddToCart = () => {
    if (product && remainingStock > 0) {
      const validQty = Math.max(1, Math.min(Number(quantity) || 1, remainingStock));
      const discountedProduct = {
        ...product,
        discount: effectiveDiscount,
        finalPrice: finalPrice
      };
      const success = addToCart(discountedProduct, validQty);
      if (success) {
        setAddedToCart(true);
        setTimeout(() => setAddedToCart(false), 2000);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <TopHeader />
        <MainHeader isMobileNavOpen={mobileNavOpen} onToggleMobileNav={() => setMobileNavOpen(!mobileNavOpen)} />
        <Navbar isMobileNavOpen={mobileNavOpen} onCloseMobileNav={() => setMobileNavOpen(false)} />
        <div className="max-w-7xl mx-auto px-4 py-24 text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-green-600 border-r-transparent mb-4" />
          <p className="text-gray-500 font-medium">Loading product details...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white">
        <TopHeader />
        <MainHeader isMobileNavOpen={mobileNavOpen} onToggleMobileNav={() => setMobileNavOpen(!mobileNavOpen)} />
        <Navbar isMobileNavOpen={mobileNavOpen} onCloseMobileNav={() => setMobileNavOpen(false)} />
        <div className="max-w-7xl mx-auto px-4 py-24 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Product Not Found</h2>
          <Link to="/" className="inline-flex items-center text-green-600 hover:text-green-700 font-semibold">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const imagesList = product.images && product.images.length > 0 ? product.images : [];
  const currentImg = selectedImage || (imagesList.length > 0 ? imagesList[0] : "");

  return (
    <div className="min-h-screen bg-white text-gray-800 font-sans">
      <TopHeader />
      <div className="sticky top-0 z-40 bg-white shadow-xs">
        <MainHeader isMobileNavOpen={mobileNavOpen} onToggleMobileNav={() => setMobileNavOpen(!mobileNavOpen)} />
        <Navbar isMobileNavOpen={mobileNavOpen} onCloseMobileNav={() => setMobileNavOpen(false)} />
      </div>

      {/* Breadcrumbs */}
      <div className="bg-gray-50 py-3.5 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-xs sm:text-sm text-gray-500 flex items-center gap-2">
          <Link to="/" className="hover:text-green-600">Home</Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-green-600">Categories</Link>
          {product.category && (
            <>
              <span>/</span>
              <Link
                to={`/shop?category=${product.category._id || product.category}`}
                className="hover:text-green-600"
              >
                {product.category.name || "Vegetables"}
              </Link>
            </>
          )}
          <span>/</span>
          <span className="text-[#00B207] font-medium truncate">{product.name}</span>
        </div>
      </div>

      {/* Main Product Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left: Gallery */}
          <ProductDetailGallery
            imagesList={imagesList}
            currentImg={currentImg}
            selectedImage={selectedImage}
            setSelectedImage={setSelectedImage}
            getImageUrl={getImageUrl}
            productName={product.name}
            hasDiscount={hasDiscount}
            effectiveDiscount={effectiveDiscount}
          />

          {/* Right: Product Details & Add to Cart */}
          <ProductDetailInfo
            product={product}
            remainingStock={remainingStock}
            hasDiscount={hasDiscount}
            effectiveDiscount={effectiveDiscount}
            finalPrice={finalPrice}
            quantity={quantity}
            handleDecreaseQuantity={handleDecreaseQuantity}
            handleIncreaseQuantity={handleIncreaseQuantity}
            handleQuantityInputChange={handleQuantityInputChange}
            handleQuantityBlur={handleQuantityBlur}
            handleAddToCart={handleAddToCart}
            addedToCart={addedToCart}
            isWishlisted={isWishlisted}
            toggleWishlist={toggleWishlist}
          />
        </div>

        {/* Tabs Section */}
        <ProductDetailTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          product={product}
          discountPercent={effectiveDiscount}
          remainingStock={remainingStock}
        />

        {/* Related Products Section */}
        <section className="mt-16 sm:mt-24 border-t border-gray-100 pt-12">
          <h3 className="text-xl sm:text-2xl font-bold text-center text-gray-900 mb-8">
            Related Products
          </h3>
          {loadingRelated ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-64 rounded-xl bg-gray-100 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          )}
        </section>
      </main>

      <Newsletter />
      <Footer />
    </div>
  );
};

export default ProductDetail;
