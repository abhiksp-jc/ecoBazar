import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import productService from "../services/productService";
import bannerService from "../services/bannerService";
import { extractCampaignDiscount, applySaleDiscountToProduct } from "../utils/discountUtils";

export const useShopProducts = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCampaign, setActiveCampaign] = useState(null);
  const [loading, setLoading] = useState(true);

  const selectedCategory = searchParams.get("category") || "";
  const campaignId = searchParams.get("campaign") || "";
  const onlyDeals = searchParams.get("deals") === "true";
  const searchQuery = searchParams.get("search") || "";
  const [sortBy, setSortBy] = useState("default");
  const [maxPrice, setMaxPrice] = useState(1500);
  const [selectedRating, setSelectedRating] = useState(0);
  const [selectedTag, setSelectedTag] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // 1. Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const catRes = await fetch("http://localhost:5000/api/categories").catch(() => null);
        if (catRes && catRes.ok) {
          const catData = await catRes.json();
          setCategories(catData?.categories || []);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  // 2. Fetch products with search query
  useEffect(() => {
    const controller = new AbortController();
    const fetchShopProducts = async () => {
      try {
        setLoading(true);
        const data = await productService.getProducts(
          { search: searchQuery },
          controller.signal
        );
        if (data !== null) {
          setProducts(data);
          setCurrentPage(1);
        }
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Error loading products:", error);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };
    fetchShopProducts();
    return () => controller.abort();
  }, [searchQuery]);

  // 3. Fetch active campaign
  useEffect(() => {
    if (!campaignId) {
      setActiveCampaign(null);
      return;
    }
    let isMounted = true;
    const fetchCampaign = async () => {
      try {
        const banner = await bannerService.getBannerById(campaignId);
        if (isMounted && banner) {
          setActiveCampaign(banner);
          const campCatId =
            typeof banner.category === "object" ? banner.category?._id : banner.category;
          if (campCatId && !searchParams.get("category")) {
            const params = new URLSearchParams(searchParams);
            params.set("category", campCatId);
            setSearchParams(params, { replace: true });
          }
        }
      } catch (err) {
        console.warn("Could not load campaign for shop:", err);
      }
    };
    fetchCampaign();
    return () => {
      isMounted = false;
    };
  }, [campaignId]);

  const handleCategorySelect = (catId) => {
    const params = new URLSearchParams(searchParams);
    if (catId) {
      params.set("category", catId);
    } else {
      params.delete("category");
    }
    setSearchParams(params);
    setCurrentPage(1);
  };

  const clearCampaignFilter = () => {
    const params = new URLSearchParams(searchParams);
    params.delete("campaign");
    setSearchParams(params);
    setActiveCampaign(null);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSearchParams({});
    setActiveCampaign(null);
    setMaxPrice(1500);
    setSelectedRating(0);
    setSelectedTag("");
    setCurrentPage(1);
  };

  const activeCategoryObj = categories.find(
    (c) => c._id === selectedCategory || c.name?.toLowerCase() === selectedCategory.toLowerCase()
  );

  const getCategoryCount = (catId) => {
    return products.filter(
      (p) => p.category?._id === catId || p.category === catId
    ).length;
  };

  const campaignDiscount = extractCampaignDiscount(activeCampaign);
  const activeSaleDiscount = campaignDiscount > 0
    ? campaignDiscount
    : (onlyDeals ? 25 : 0);

  let filteredProducts = products.filter((item) => {
    if (activeCampaign) {
      if (
        activeCampaign.productFilterType === "specific" &&
        Array.isArray(activeCampaign.selectedProducts) &&
        activeCampaign.selectedProducts.length > 0
      ) {
        const allowedIds = activeCampaign.selectedProducts.map((p) =>
          typeof p === "object" ? p._id : p
        );
        if (!allowedIds.includes(item._id)) return false;
      }
      if (
        activeCampaign.productFilterType === "discounted" &&
        activeSaleDiscount <= 0 &&
        Number(item.discount || 0) <= 0
      ) {
        return false;
      }
    }

    if (selectedCategory) {
      const match =
        item.category?._id === selectedCategory ||
        item.category === selectedCategory ||
        item.category?.name?.toLowerCase() === selectedCategory.toLowerCase();
      if (!match) return false;
    }

    if (onlyDeals && activeSaleDiscount <= 0 && Number(item.discount || 0) <= 0) {
      return false;
    }

    if (searchQuery && searchQuery.trim()) {
      const query = searchQuery.trim().toLowerCase();
      const matchName = item.name?.toLowerCase().includes(query);
      const matchDesc = item.description?.toLowerCase().includes(query);
      const categoryName = (typeof item.category === "object" ? item.category?.name : "") || "";
      const matchCat = categoryName.toLowerCase().includes(query);
      if (!matchName && !matchDesc && !matchCat) return false;
    }

    const price = Number(item.price || 0);
    if (price > maxPrice) return false;

    if (selectedRating > 0) {
      const rating = Number(item.rating || item.averageRating || 4);
      if (rating < selectedRating) return false;
    }

    if (selectedTag) {
      const tagStr = (item.tags || []).join(" ").toLowerCase();
      const nameStr = item.name?.toLowerCase() || "";
      if (!tagStr.includes(selectedTag.toLowerCase()) && !nameStr.includes(selectedTag.toLowerCase())) {
        return false;
      }
    }
    return true;
  });

  if (activeSaleDiscount > 0) {
    filteredProducts = filteredProducts.map((item) =>
      applySaleDiscountToProduct(item, activeSaleDiscount)
    );
  }

  if (sortBy === "price-low") {
    filteredProducts.sort((a, b) => Number(a.finalPrice || a.price) - Number(b.finalPrice || b.price));
  } else if (sortBy === "price-high") {
    filteredProducts.sort((a, b) => Number(b.finalPrice || b.price) - Number(a.finalPrice || a.price));
  } else if (sortBy === "discount") {
    filteredProducts.sort((a, b) => Number(b.discount || 0) - Number(a.discount || 0));
  }

  const calculatedPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const totalPages = filteredProducts.length > 0 ? (calculatedPages > 21 ? calculatedPages : 21) : 0;

  let paginatedProducts = [];
  if (filteredProducts.length > 0) {
    if (filteredProducts.length >= totalPages * itemsPerPage) {
      paginatedProducts = filteredProducts.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
      );
    } else {
      const offset = ((currentPage - 1) * 3) % filteredProducts.length;
      const rotated = [
        ...filteredProducts.slice(offset),
        ...filteredProducts.slice(0, offset)
      ];
      paginatedProducts = rotated.slice(0, itemsPerPage);
    }
  }

  const saleProducts = (filteredProducts.length > 0 ? filteredProducts : products)
    .filter((p) => Number(p.discount || 0) > 0)
    .slice(0, 3);

  return {
    products,
    categories,
    loading,
    activeCampaign,
    searchParams,
    setSearchParams,
    selectedCategory,
    onlyDeals,
    searchQuery,
    sortBy,
    setSortBy,
    maxPrice,
    setMaxPrice,
    selectedRating,
    setSelectedRating,
    selectedTag,
    setSelectedTag,
    currentPage,
    setCurrentPage,
    handleCategorySelect,
    clearCampaignFilter,
    clearFilters,
    activeCategoryObj,
    getCategoryCount,
    activeSaleDiscount,
    filteredProducts,
    paginatedProducts,
    totalPages,
    saleProducts
  };
};
