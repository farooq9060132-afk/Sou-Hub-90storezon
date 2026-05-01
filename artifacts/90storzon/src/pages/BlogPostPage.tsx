import { useEffect } from "react";
import { Link, useParams } from "wouter";
import { ArrowLeft, Calendar } from "lucide-react";
import { useGetBlogPost, useTrackPageView, getGetBlogPostQueryKey } from "@workspace/api-client-react";

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: post, isLoading, error } = useGetBlogPost(slug, { query: { queryKey: getGetBlogPostQueryKey(slug) } });
  const trackPageView = useTrackPageView();

  useEffect(() => {
    if (post) {
      document.title = `${post.title} — 90StorZon Blog`;
    }
    trackPageView.mutate({ data: { page: `/blog/${slug}`, referrer: document.referrer || undefined } });
  }, [post, slug]);

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 animate-pulse">
        <div className="h-4 bg-muted rounded w-24 mb-6" />
        <div className="h-10 bg-muted rounded w-3/4 mb-4" />
        <div className="h-4 bg-muted rounded w-1/3 mb-8" />
        {[1, 2, 3, 4, 5].map(i => <div key={i} className="h-4 bg-muted rounded w-full mb-3" />)}
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-foreground mb-3">Article Not Found</h1>
        <p className="text-muted-foreground mb-6">This blog post doesn't exist or has been removed.</p>
        <Link href="/blog" className="text-primary font-medium hover:underline">Back to Blog</Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <Link href="/blog" className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground text-sm mb-6 transition-colors" data-testid="blog-back-link">
        <ArrowLeft className="w-4 h-4" /> Back to Blog
      </Link>

      <div className="flex items-center gap-3 mb-4">
        <span className="px-3 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full">{post.category}</span>
        <span className="text-sm text-muted-foreground flex items-center gap-1">
          <Calendar className="w-3.5 h-3.5" />
          {new Date(post.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
        </span>
      </div>

      <h1 className="text-4xl font-bold text-foreground leading-tight mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{post.title}</h1>
      <p className="text-xl text-muted-foreground mb-8 leading-relaxed">{post.excerpt}</p>

      <div className="h-56 bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl mb-8" />

      <article className="prose prose-lg max-w-none text-foreground">
        {post.content.split('\n').map((line, i) => {
          if (line.startsWith('## ')) return <h2 key={i} className="text-2xl font-bold text-foreground mt-8 mb-3">{line.slice(3)}</h2>;
          if (line.startsWith('# ')) return <h1 key={i} className="text-3xl font-bold text-foreground mt-8 mb-3">{line.slice(2)}</h1>;
          if (line.startsWith('- **')) {
            const parts = line.slice(2).split('**');
            return <p key={i} className="text-foreground my-1"><strong>{parts[1]}</strong>{parts[2]}</p>;
          }
          if (line.trim() === '') return <br key={i} />;
          return <p key={i} className="text-foreground leading-relaxed my-3">{line}</p>;
        })}
      </article>
    </div>
  );
}
