import { useEffect } from "react";
import { Link } from "wouter";
import { Calendar, ArrowRight } from "lucide-react";
import { useListBlogPosts, useTrackPageView, getListBlogPostsQueryKey } from "@workspace/api-client-react";

export default function BlogPage() {
  const { data: posts, isLoading } = useListBlogPosts({ query: { queryKey: getListBlogPostsQueryKey() } });
  const trackPageView = useTrackPageView();

  useEffect(() => {
    document.title = "Blog — Tips, Guides & Insights | 90StorZon";
    trackPageView.mutate({ data: { page: "/blog", referrer: document.referrer || undefined } });
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-foreground mb-3" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Blog</h1>
        <p className="text-lg text-muted-foreground">Expert guides, tips, and how-to articles</p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-card rounded-xl border border-card-border p-6 animate-pulse">
              <div className="h-3 bg-muted rounded w-1/4 mb-3" />
              <div className="h-6 bg-muted rounded w-full mb-2" />
              <div className="h-4 bg-muted rounded w-5/6 mb-1" />
              <div className="h-4 bg-muted rounded w-4/6" />
            </div>
          ))}
        </div>
      ) : posts && posts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="group bg-card rounded-xl border border-card-border overflow-hidden hover:border-primary/50 hover:shadow-lg transition-all"
              data-testid={`blog-post-${post.id}`}
            >
              <div className="h-32 bg-gradient-to-br from-primary/20 to-accent/20" />
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-2 py-0.5 text-xs font-medium bg-primary/10 text-primary rounded-full">{post.category}</span>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(post.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <h2 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors mb-2 line-clamp-2">{post.title}</h2>
                <p className="text-sm text-muted-foreground line-clamp-3">{post.excerpt}</p>
                <div className="flex items-center gap-1 mt-4 text-primary text-sm font-medium">
                  Read article <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-muted-foreground text-lg">No blog posts yet. Check back soon!</p>
        </div>
      )}
    </div>
  );
}
