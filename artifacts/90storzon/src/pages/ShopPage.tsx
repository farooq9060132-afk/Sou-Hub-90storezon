import { useEffect, useState } from "react";
import { Link } from "wouter";
import { ShoppingCart, Star, ArrowRight, Filter } from "lucide-react";
import { useListProducts, useTrackPageView, getListProductsQueryKey } from "@workspace/api-client-react";

export default function ShopPage() {
  const { data: products, isLoading } = useListProducts({ query: { queryKey: getListProductsQueryKey() } });
  const trackPageView = useTrackPageView();
  const [filter, setFilter] = useState<"all" | "featured">("all");

  useEffect(() => {
    document.title = "Shop — Self Defense Kitchen Tools & More | 90StorZon";
    trackPageView.mutate({ data: { page: "/shop", referrer: document.referrer || undefined } });
  }, []);

  const filtered = products ? (filter === "featured" ? products.filter(p => p.featured) : products) : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-foreground mb-3" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Our Shop</h1>
        <p className="text-lg text-muted-foreground">Quality Self Defense Kitchen Tools &amp; Home Essentials</p>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-3 mb-8">
        <Filter className="w-4 h-4 text-muted-foreground" />
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${filter === "all" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"}`}
          data-testid="filter-all"
        >
          All Products
        </button>
        <button
          onClick={() => setFilter("featured")}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${filter === "featured" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"}`}
          data-testid="filter-featured"
        >
          Featured
        </button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="bg-card rounded-xl border border-card-border overflow-hidden animate-pulse">
              <div className="h-48 bg-muted" />
              <div className="p-5">
                <div className="h-5 bg-muted rounded w-3/4 mb-2" />
                <div className="h-4 bg-muted rounded w-full mb-1" />
                <div className="h-4 bg-muted rounded w-4/5" />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((product) => (
            <Link
              key={product.id}
              href={`/shop/${product.id}`}
              className="group bg-card rounded-xl border border-card-border overflow-hidden hover:border-primary/50 hover:shadow-lg transition-all"
              data-testid={`product-card-${product.id}`}
            >
              <div className="relative h-48 bg-gradient-to-br from-primary/15 to-accent/15 flex items-center justify-center">
                <ShoppingCart className="w-14 h-14 text-primary/30" />
                {product.featured && (
                  <div className="absolute top-3 right-3 bg-accent text-accent-foreground text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                    <Star className="w-3 h-3" /> Featured
                  </div>
                )}
              </div>
              <div className="p-5">
                <span className="text-xs font-medium text-muted-foreground">{product.category}</span>
                <h3 className="text-lg font-semibold text-foreground mt-1 group-hover:text-primary transition-colors">{product.name}</h3>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{product.description}</p>
                <div className="flex items-center justify-between mt-4">
                  <span className="text-xl font-bold text-primary">${Number(product.price).toFixed(2)}</span>
                  <span className="text-sm text-muted-foreground flex items-center gap-1 group-hover:text-primary transition-colors">
                    View details <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <ShoppingCart className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground text-lg">No products found.</p>
        </div>
      )}
    </div>
  );
}
