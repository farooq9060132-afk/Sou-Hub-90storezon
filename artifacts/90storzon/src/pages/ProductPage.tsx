import { useEffect, useCallback } from "react";
import { Link, useParams } from "wouter";
import { ArrowLeft, ShoppingCart, ExternalLink, Star } from "lucide-react";
import { useGetProduct, useTrackPageView, useTrackAffiliateClick, getGetProductQueryKey } from "@workspace/api-client-react";
import SEO from "@/components/SEO";
import AdSense from "@/components/AdSense";

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const productId = parseInt(id, 10);
  const { data: product, isLoading, error } = useGetProduct(productId, { query: { queryKey: getGetProductQueryKey(productId), enabled: !isNaN(productId) } });
  const trackPageView = useTrackPageView();
  const trackClick = useTrackAffiliateClick();

  useEffect(() => {
    trackPageView.mutate({ data: { page: `/shop/${id}`, referrer: document.referrer || undefined } });
  }, [id]);

  const handleBuyClick = useCallback(() => {
    if (!isNaN(productId)) {
      trackClick.mutate({ id: productId });
    }
  }, [productId]);

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12 animate-pulse">
        <div className="h-4 bg-muted rounded w-24 mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="h-80 bg-muted rounded-xl" />
          <div>
            <div className="h-8 bg-muted rounded w-3/4 mb-4" />
            <div className="h-4 bg-muted rounded w-full mb-2" />
            <div className="h-4 bg-muted rounded w-5/6 mb-2" />
            <div className="h-10 bg-muted rounded w-1/3 mt-6" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-foreground mb-3">Product Not Found</h1>
        <p className="text-muted-foreground mb-6">This product doesn't exist or has been removed.</p>
        <Link href="/shop" className="text-primary font-medium hover:underline">Back to Shop</Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <SEO
        title={product.name}
        description={product.description}
        ogType="article"
        canonical={`/shop/${productId}`}
      />

      <Link href="/shop" className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground text-sm mb-8 transition-colors" data-testid="product-back-link">
        <ArrowLeft className="w-4 h-4" /> Back to Shop
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-primary/20 to-accent/20 h-80 flex items-center justify-center">
          {product.imageUrl ? (
            <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
          ) : (
            <ShoppingCart className="w-24 h-24 text-primary/25" />
          )}
          {product.featured && (
            <div className="absolute top-4 right-4 bg-accent text-accent-foreground text-sm font-bold px-3 py-1 rounded-full flex items-center gap-1.5">
              <Star className="w-3.5 h-3.5" /> Featured
            </div>
          )}
        </div>

        <div>
          <span className="text-sm font-medium text-muted-foreground">{product.category}</span>
          <h1 className="text-3xl font-bold text-foreground mt-1 mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{product.name}</h1>
          <p className="text-muted-foreground leading-relaxed mb-6">{product.description}</p>

          <div className="flex items-baseline gap-2 mb-6">
            <span className="text-4xl font-bold text-primary" data-testid="product-price">${Number(product.price).toFixed(2)}</span>
          </div>

          <div className="flex flex-col gap-3">
            {product.externalLink ? (
              <a
                href={product.externalLink}
                target="_blank"
                rel="noopener noreferrer sponsored"
                onClick={handleBuyClick}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-colors shadow-md"
                data-testid="product-buy-link"
              >
                <ExternalLink className="w-4 h-4" />
                Buy Now
              </a>
            ) : (
              <button className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-lg opacity-60 cursor-not-allowed" disabled>
                <ShoppingCart className="w-4 h-4" />
                Not Available
              </button>
            )}
            <Link href="/shop" className="text-center py-3 border border-border rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>

      <div className="mt-12">
        <AdSense slot="in-content" />
      </div>
    </div>
  );
}
