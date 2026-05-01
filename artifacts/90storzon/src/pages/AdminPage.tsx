import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import {
  Users, TrendingUp, Wrench, Trash2, Shield, ArrowLeft,
  Plus, Edit2, Save, X, BarChart2, Package, FileText, Star, ExternalLink
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend
} from "recharts";
import {
  useGetCurrentUser, useGetAdminStats, useListUsers, useDeleteUser,
  useListBlogPosts, useCreateBlogPost, useUpdateBlogPost, useDeleteBlogPost,
  useListProducts, useCreateProduct, useUpdateProduct, useDeleteProduct,
  useGetAnalyticsSummary, useGetDailyAnalytics, useGetAffiliateStats,
  getGetCurrentUserQueryKey, getGetAdminStatsQueryKey, getListUsersQueryKey,
  getListBlogPostsQueryKey, getListProductsQueryKey,
  getGetAnalyticsSummaryQueryKey, getGetDailyAnalyticsQueryKey, getGetAffiliateStatsQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import SEO from "@/components/SEO";

type Tab = "dashboard" | "blog" | "products" | "users" | "analytics";

const CHART_COLORS = ["#0ea5e9", "#f59e0b", "#10b981", "#8b5cf6", "#ef4444", "#ec4899"];

interface BlogForm {
  id?: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  imageUrl: string;
  metaTitle: string;
  metaDescription: string;
}

interface ProductForm {
  id?: number;
  name: string;
  description: string;
  price: string;
  category: string;
  imageUrl: string;
  externalLink: string;
  featured: boolean;
}

const emptyBlog: BlogForm = { title: "", slug: "", excerpt: "", content: "", category: "", imageUrl: "", metaTitle: "", metaDescription: "" };
const emptyProduct: ProductForm = { name: "", description: "", price: "", category: "", imageUrl: "", externalLink: "", featured: false };

export default function AdminPage() {
  const [, navigate] = useLocation();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [tab, setTab] = useState<Tab>("dashboard");
  const [blogForm, setBlogForm] = useState<BlogForm | null>(null);
  const [productForm, setProductForm] = useState<ProductForm | null>(null);

  const { data: user, isLoading: userLoading } = useGetCurrentUser({ query: { queryKey: getGetCurrentUserQueryKey() } });
  const { data: stats } = useGetAdminStats({ query: { queryKey: getGetAdminStatsQueryKey() } });
  const { data: users, isLoading: usersLoading } = useListUsers({ query: { queryKey: getListUsersQueryKey() } });
  const { data: posts, isLoading: postsLoading } = useListBlogPosts({ query: { queryKey: getListBlogPostsQueryKey() } });
  const { data: products, isLoading: productsLoading } = useListProducts({ query: { queryKey: getListProductsQueryKey() } });
  const { data: analyticsSummary } = useGetAnalyticsSummary({ query: { queryKey: getGetAnalyticsSummaryQueryKey() } });
  const { data: dailyStats } = useGetDailyAnalytics({ query: { queryKey: getGetDailyAnalyticsQueryKey() } });
  const { data: affiliateStats } = useGetAffiliateStats({ query: { queryKey: getGetAffiliateStatsQueryKey() } });

  const deleteUser = useDeleteUser();
  const createBlogPost = useCreateBlogPost();
  const updateBlogPost = useUpdateBlogPost();
  const deleteBlogPost = useDeleteBlogPost();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();

  useEffect(() => {
    if (!userLoading && (!user || !user.isAdmin)) navigate(user ? "/dashboard" : "/login");
  }, [user, userLoading]);

  if (userLoading) return <div className="max-w-6xl mx-auto px-4 py-12 animate-pulse"><div className="h-8 bg-muted rounded w-1/4 mb-8" /></div>;
  if (!user?.isAdmin) return null;

  const handleDeleteUser = (id: number, name: string) => {
    if (!confirm(`Delete user "${name}"?`)) return;
    deleteUser.mutate({ id }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListUsersQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetAdminStatsQueryKey() });
        toast({ title: "User deleted" });
      },
      onError: () => toast({ title: "Error", variant: "destructive" }),
    });
  };

  const handleSaveBlog = () => {
    if (!blogForm) return;
    const data = {
      title: blogForm.title, slug: blogForm.slug, excerpt: blogForm.excerpt,
      content: blogForm.content, category: blogForm.category,
      imageUrl: blogForm.imageUrl || undefined,
      metaTitle: blogForm.metaTitle || undefined,
      metaDescription: blogForm.metaDescription || undefined,
    };
    if (blogForm.id) {
      updateBlogPost.mutate({ id: blogForm.id, data }, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListBlogPostsQueryKey() });
          toast({ title: "Post updated!" });
          setBlogForm(null);
        },
        onError: () => toast({ title: "Error saving post", variant: "destructive" }),
      });
    } else {
      createBlogPost.mutate({ data }, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListBlogPostsQueryKey() });
          toast({ title: "Post created!" });
          setBlogForm(null);
        },
        onError: () => toast({ title: "Error creating post", variant: "destructive" }),
      });
    }
  };

  const handleDeleteBlog = (id: number, title: string) => {
    if (!confirm(`Delete "${title}"?`)) return;
    deleteBlogPost.mutate({ id }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListBlogPostsQueryKey() });
        toast({ title: "Post deleted" });
      },
      onError: () => toast({ title: "Error", variant: "destructive" }),
    });
  };

  const handleSaveProduct = () => {
    if (!productForm) return;
    const data = {
      name: productForm.name, description: productForm.description,
      price: parseFloat(productForm.price) || 0,
      category: productForm.category,
      imageUrl: productForm.imageUrl || undefined,
      externalLink: productForm.externalLink || undefined,
      featured: productForm.featured,
    };
    if (productForm.id) {
      updateProduct.mutate({ id: productForm.id, data }, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListProductsQueryKey() });
          toast({ title: "Product updated!" });
          setProductForm(null);
        },
        onError: () => toast({ title: "Error saving product", variant: "destructive" }),
      });
    } else {
      createProduct.mutate({ data }, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListProductsQueryKey() });
          toast({ title: "Product created!" });
          setProductForm(null);
        },
        onError: () => toast({ title: "Error creating product", variant: "destructive" }),
      });
    }
  };

  const handleDeleteProduct = (id: number, name: string) => {
    if (!confirm(`Delete "${name}"?`)) return;
    deleteProduct.mutate({ id }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListProductsQueryKey() });
        toast({ title: "Product deleted" });
      },
      onError: () => toast({ title: "Error", variant: "destructive" }),
    });
  };

  const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: "dashboard", label: "Dashboard", icon: BarChart2 },
    { id: "blog", label: "Blog", icon: FileText },
    { id: "products", label: "Products", icon: Package },
    { id: "users", label: "Users", icon: Users },
    { id: "analytics", label: "Analytics", icon: TrendingUp },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <SEO title="Admin Panel" noIndex />
      <div className="flex items-center gap-3 mb-6">
        <Link href="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <Shield className="w-6 h-6 text-primary" />
        <h1 className="text-2xl font-bold text-foreground" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Admin Panel</h1>
      </div>

      <div className="flex gap-1 mb-8 bg-muted p-1 rounded-xl overflow-x-auto">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${tab === t.id ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
            data-testid={`admin-tab-${t.id}`}
          >
            <t.icon className="w-4 h-4" />{t.label}
          </button>
        ))}
      </div>

      {tab === "dashboard" && (
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
            {[
              { label: "Total Users", value: stats?.totalUsers ?? "-", icon: Users },
              { label: "Page Views", value: stats?.totalPageViews ?? "-", icon: TrendingUp },
              { label: "Tool Uses", value: stats?.totalToolUsage ?? "-", icon: Wrench },
            ].map(item => (
              <div key={item.label} className="bg-card rounded-xl border border-card-border p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <item.icon className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-sm font-medium text-muted-foreground">{item.label}</span>
                </div>
                <p className="text-4xl font-bold text-foreground">{item.value}</p>
              </div>
            ))}
          </div>
          {stats && stats.toolStats.length > 0 && (
            <div className="bg-card rounded-xl border border-card-border p-6 mb-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">Tool Usage</h2>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={stats.toolStats.slice(0, 8)} layout="vertical" margin={{ left: 100 }}>
                  <XAxis type="number" tick={{ fontSize: 12 }} />
                  <YAxis type="category" dataKey="tool" tick={{ fontSize: 12 }} width={100} />
                  <Tooltip />
                  <Bar dataKey="count" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      )}

      {tab === "analytics" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-card rounded-xl border border-card-border p-6">
              <p className="text-sm font-medium text-muted-foreground mb-1">Total Page Views</p>
              <p className="text-4xl font-bold text-primary">{analyticsSummary?.totalPageViews ?? 0}</p>
            </div>
            <div className="bg-card rounded-xl border border-card-border p-6">
              <p className="text-sm font-medium text-muted-foreground mb-1">Unique Pages</p>
              <p className="text-4xl font-bold text-primary">{analyticsSummary?.uniquePages ?? 0}</p>
            </div>
          </div>

          {dailyStats && dailyStats.length > 0 && (
            <div className="bg-card rounded-xl border border-card-border p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">Daily Page Views (Last 30 Days)</h2>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={dailyStats}>
                  <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {analyticsSummary && analyticsSummary.referrers.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-card rounded-xl border border-card-border p-6">
                <h2 className="text-lg font-semibold text-foreground mb-4">Traffic Sources</h2>
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie data={analyticsSummary.referrers} dataKey="count" nameKey="referrer" cx="50%" cy="50%" outerRadius={80} label={({ referrer }) => referrer}>
                      {analyticsSummary.referrers.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="bg-card rounded-xl border border-card-border p-6">
                <h2 className="text-lg font-semibold text-foreground mb-4">Top Pages</h2>
                <div className="space-y-2">
                  {analyticsSummary.topPages.slice(0, 8).map(p => (
                    <div key={p.page} className="flex items-center gap-2">
                      <span className="text-sm text-foreground truncate flex-1">{p.page}</span>
                      <span className="text-sm font-medium text-primary shrink-0">{p.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {affiliateStats && affiliateStats.length > 0 && (
            <div className="bg-card rounded-xl border border-card-border p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">Affiliate Link Clicks</h2>
              <div className="space-y-3">
                {affiliateStats.map(stat => (
                  <div key={stat.productId} className="flex items-center gap-3">
                    <ExternalLink className="w-4 h-4 text-muted-foreground shrink-0" />
                    <span className="text-sm text-foreground flex-1 truncate">{stat.productName}</span>
                    <span className="text-sm font-bold text-primary">{stat.count} clicks</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {tab === "blog" && (
        <div>
          {blogForm ? (
            <div className="bg-card rounded-xl border border-card-border p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold">{blogForm.id ? "Edit Post" : "New Post"}</h2>
                <button onClick={() => setBlogForm(null)} className="text-muted-foreground hover:text-foreground"><X className="w-5 h-5" /></button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div><label className="text-sm font-medium block mb-1">Title *</label><Input value={blogForm.title} onChange={e => setBlogForm(f => f && ({ ...f, title: e.target.value, slug: f.slug || e.target.value.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") }))} /></div>
                <div><label className="text-sm font-medium block mb-1">Slug *</label><Input value={blogForm.slug} onChange={e => setBlogForm(f => f && ({ ...f, slug: e.target.value }))} /></div>
                <div><label className="text-sm font-medium block mb-1">Category *</label><Input value={blogForm.category} onChange={e => setBlogForm(f => f && ({ ...f, category: e.target.value }))} /></div>
                <div><label className="text-sm font-medium block mb-1">Image URL</label><Input value={blogForm.imageUrl} onChange={e => setBlogForm(f => f && ({ ...f, imageUrl: e.target.value }))} /></div>
                <div><label className="text-sm font-medium block mb-1">Meta Title</label><Input value={blogForm.metaTitle} onChange={e => setBlogForm(f => f && ({ ...f, metaTitle: e.target.value }))} /></div>
                <div><label className="text-sm font-medium block mb-1">Meta Description</label><Input value={blogForm.metaDescription} onChange={e => setBlogForm(f => f && ({ ...f, metaDescription: e.target.value }))} /></div>
              </div>
              <div className="mb-4"><label className="text-sm font-medium block mb-1">Excerpt *</label><Textarea rows={2} value={blogForm.excerpt} onChange={e => setBlogForm(f => f && ({ ...f, excerpt: e.target.value }))} /></div>
              <div className="mb-6"><label className="text-sm font-medium block mb-1">Content * (Markdown supported)</label><Textarea rows={12} value={blogForm.content} onChange={e => setBlogForm(f => f && ({ ...f, content: e.target.value }))} className="font-mono text-sm" /></div>
              <div className="flex gap-3">
                <Button onClick={handleSaveBlog} disabled={createBlogPost.isPending || updateBlogPost.isPending}>
                  <Save className="w-4 h-4 mr-2" />{blogForm.id ? "Update Post" : "Create Post"}
                </Button>
                <Button variant="outline" onClick={() => setBlogForm(null)}>Cancel</Button>
              </div>
            </div>
          ) : (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Blog Posts ({posts?.length ?? 0})</h2>
                <Button onClick={() => setBlogForm({ ...emptyBlog })} data-testid="admin-new-post">
                  <Plus className="w-4 h-4 mr-2" />New Post
                </Button>
              </div>
              {postsLoading ? <div className="animate-pulse space-y-3">{[1,2,3].map(i => <div key={i} className="h-16 bg-muted rounded-xl" />)}</div> : (
                <div className="space-y-3">
                  {(posts || []).map(post => (
                    <div key={post.id} className="bg-card rounded-xl border border-card-border p-4 flex items-start gap-4" data-testid={`admin-post-${post.id}`}>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-full">{post.category}</span>
                          <span className="text-xs text-muted-foreground">{new Date(post.createdAt).toLocaleDateString()}</span>
                        </div>
                        <h3 className="font-medium text-foreground truncate">{post.title}</h3>
                        <p className="text-xs text-muted-foreground truncate mt-0.5">{post.excerpt}</p>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <button onClick={() => setBlogForm({ id: post.id, title: post.title, slug: post.slug, excerpt: post.excerpt, content: post.content, category: post.category, imageUrl: post.imageUrl || "", metaTitle: post.metaTitle || "", metaDescription: post.metaDescription || "" })}
                          className="p-1.5 rounded hover:bg-muted transition-colors" data-testid={`admin-edit-post-${post.id}`}>
                          <Edit2 className="w-4 h-4 text-muted-foreground" />
                        </button>
                        <button onClick={() => handleDeleteBlog(post.id, post.title)}
                          className="p-1.5 rounded hover:bg-destructive/10 transition-colors" data-testid={`admin-delete-post-${post.id}`}>
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {tab === "products" && (
        <div>
          {productForm ? (
            <div className="bg-card rounded-xl border border-card-border p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold">{productForm.id ? "Edit Product" : "New Product"}</h2>
                <button onClick={() => setProductForm(null)} className="text-muted-foreground hover:text-foreground"><X className="w-5 h-5" /></button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div><label className="text-sm font-medium block mb-1">Name *</label><Input value={productForm.name} onChange={e => setProductForm(f => f && ({ ...f, name: e.target.value }))} /></div>
                <div><label className="text-sm font-medium block mb-1">Price ($) *</label><Input type="number" step="0.01" value={productForm.price} onChange={e => setProductForm(f => f && ({ ...f, price: e.target.value }))} /></div>
                <div><label className="text-sm font-medium block mb-1">Category *</label><Input value={productForm.category} onChange={e => setProductForm(f => f && ({ ...f, category: e.target.value }))} /></div>
                <div><label className="text-sm font-medium block mb-1">Affiliate Link</label><Input value={productForm.externalLink} onChange={e => setProductForm(f => f && ({ ...f, externalLink: e.target.value }))} /></div>
                <div><label className="text-sm font-medium block mb-1">Image URL</label><Input value={productForm.imageUrl} onChange={e => setProductForm(f => f && ({ ...f, imageUrl: e.target.value }))} /></div>
                <div className="flex items-center gap-2 pt-6">
                  <input type="checkbox" id="featured" checked={productForm.featured} onChange={e => setProductForm(f => f && ({ ...f, featured: e.target.checked }))} />
                  <label htmlFor="featured" className="text-sm font-medium cursor-pointer">Featured product</label>
                </div>
              </div>
              <div className="mb-6"><label className="text-sm font-medium block mb-1">Description *</label><Textarea rows={4} value={productForm.description} onChange={e => setProductForm(f => f && ({ ...f, description: e.target.value }))} /></div>
              <div className="flex gap-3">
                <Button onClick={handleSaveProduct} disabled={createProduct.isPending || updateProduct.isPending}>
                  <Save className="w-4 h-4 mr-2" />{productForm.id ? "Update Product" : "Create Product"}
                </Button>
                <Button variant="outline" onClick={() => setProductForm(null)}>Cancel</Button>
              </div>
            </div>
          ) : (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Products ({products?.length ?? 0})</h2>
                <Button onClick={() => setProductForm({ ...emptyProduct })} data-testid="admin-new-product">
                  <Plus className="w-4 h-4 mr-2" />New Product
                </Button>
              </div>
              {productsLoading ? <div className="animate-pulse space-y-3">{[1,2,3].map(i => <div key={i} className="h-16 bg-muted rounded-xl" />)}</div> : (
                <div className="space-y-3">
                  {(products || []).map(product => (
                    <div key={product.id} className="bg-card rounded-xl border border-card-border p-4 flex items-center gap-4" data-testid={`admin-product-${product.id}`}>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-xs px-2 py-0.5 bg-muted rounded-full text-muted-foreground">{product.category}</span>
                          {product.featured && <Star className="w-3.5 h-3.5 text-amber-500" />}
                        </div>
                        <h3 className="font-medium text-foreground">{product.name}</h3>
                        <p className="text-sm text-primary font-semibold">${Number(product.price).toFixed(2)}</p>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <button onClick={() => setProductForm({ id: product.id, name: product.name, description: product.description, price: String(product.price), category: product.category, imageUrl: product.imageUrl || "", externalLink: product.externalLink || "", featured: product.featured })}
                          className="p-1.5 rounded hover:bg-muted transition-colors" data-testid={`admin-edit-product-${product.id}`}>
                          <Edit2 className="w-4 h-4 text-muted-foreground" />
                        </button>
                        <button onClick={() => handleDeleteProduct(product.id, product.name)}
                          className="p-1.5 rounded hover:bg-destructive/10 transition-colors" data-testid={`admin-delete-product-${product.id}`}>
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {tab === "users" && (
        <div className="bg-card rounded-xl border border-card-border overflow-hidden">
          <div className="p-5 border-b border-border">
            <h2 className="text-lg font-semibold text-foreground">Users ({users?.length ?? 0})</h2>
          </div>
          {usersLoading ? <div className="p-6 animate-pulse space-y-3">{[1,2,3].map(i => <div key={i} className="h-12 bg-muted rounded" />)}</div> : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b border-border bg-muted/50">
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Name</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Email</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Role</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Joined</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Actions</th>
                </tr></thead>
                <tbody>
                  {(users || []).map(u => (
                    <tr key={u.id} className="border-b border-border hover:bg-muted/30 transition-colors" data-testid={`admin-user-row-${u.id}`}>
                      <td className="px-4 py-3 font-medium text-foreground">{u.name}</td>
                      <td className="px-4 py-3 text-muted-foreground">{u.email}</td>
                      <td className="px-4 py-3">
                        {u.isAdmin ? <span className="px-2 py-0.5 text-xs font-medium bg-primary/10 text-primary rounded-full">Admin</span> : <span className="px-2 py-0.5 text-xs font-medium bg-muted text-muted-foreground rounded-full">User</span>}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{new Date(u.createdAt).toLocaleDateString()}</td>
                      <td className="px-4 py-3">
                        {u.id !== user.id && <button onClick={() => handleDeleteUser(u.id, u.name)} disabled={deleteUser.isPending} className="p-1.5 text-destructive hover:bg-destructive/10 rounded" data-testid={`admin-delete-user-${u.id}`}><Trash2 className="w-4 h-4" /></button>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
