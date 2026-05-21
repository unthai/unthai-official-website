import React, { useEffect, useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Newsletter from '../components/Newsletter';
import heroBg from '../assets/unthai-ai-automation-bg.webp';
import { fetchPostBySlug, fetchPosts } from '../data/postsClient';

const SITE_URL = 'https://unth.ai';

const BlogPost = () => {
    const { slug } = useParams();
    const [post, setPost] = useState(null);
    const [related, setRelated] = useState([]);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);

    useEffect(() => {
        let cancelled = false;
        setLoading(true);
        (async () => {
            const [p, all] = await Promise.all([fetchPostBySlug(slug), fetchPosts()]);
            if (cancelled) return;
            if (!p) {
                setNotFound(true);
            } else {
                setPost(p);
                setRelated(all.filter((x) => x.slug !== p.slug).slice(0, 3));
            }
            setLoading(false);
        })();
        return () => { cancelled = true; };
    }, [slug]);

    if (notFound) return <Navigate to="/blog" replace />;
    if (loading || !post) {
        return (
            <div style={{ background: 'var(--color-primary)', minHeight: '100vh' }}>
                <Header />
                <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-muted)' }}>
                    Loading…
                </div>
                <Footer />
            </div>
        );
    }

    const canonical = `${SITE_URL}/blog/${post.slug}`;
    const heroImg = post.image || heroBg;

    return (
        <div style={{ background: 'var(--color-primary)', minHeight: '100vh', display: 'flex', flexDirection: 'column', color: 'var(--color-text-main)' }}>
            <Helmet>
                <title>{post.title} — UNTH.AI</title>
                <meta name="description" content={post.excerpt} />
                <link rel="canonical" href={canonical} />
                <meta property="og:type" content="article" />
                <meta property="og:title" content={post.title} />
                <meta property="og:description" content={post.excerpt} />
                <meta property="og:url" content={canonical} />
                {post.image && <meta property="og:image" content={post.image.startsWith('http') ? post.image : `${SITE_URL}${post.image}`} />}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={post.title} />
                <meta name="twitter:description" content={post.excerpt} />
                {post.image && <meta name="twitter:image" content={post.image.startsWith('http') ? post.image : `${SITE_URL}${post.image}`} />}
                <script type="application/ld+json">
                    {JSON.stringify({
                        '@context': 'https://schema.org',
                        '@graph': [
                            {
                                '@type': 'BlogPosting',
                                headline: post.title,
                                description: post.excerpt,
                                datePublished: post.date,
                                dateModified: post.date,
                                author: { '@type': 'Organization', name: 'UNTH.AI', url: SITE_URL },
                                publisher: { '@type': 'Organization', name: 'UNTH.AI', logo: { '@type': 'ImageObject', url: `${SITE_URL}/unthai-logo.png` } },
                                mainEntityOfPage: canonical,
                                image: post.image ? (post.image.startsWith('http') ? post.image : `${SITE_URL}${post.image}`) : undefined,
                                articleSection: post.category,
                                inLanguage: 'en',
                            },
                            {
                                '@type': 'BreadcrumbList',
                                itemListElement: [
                                    { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
                                    { '@type': 'ListItem', position: 2, name: 'Blog', item: `${SITE_URL}/blog` },
                                    { '@type': 'ListItem', position: 3, name: post.title, item: canonical },
                                ],
                            },
                        ],
                    })}
                </script>
            </Helmet>

            <Header />

            {/* Hero */}
            <section style={{
                position: 'relative',
                minHeight: '420px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                paddingTop: '120px',
                paddingBottom: '64px'
            }}>
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundImage: `url(${heroImg})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    opacity: 0.45,
                    zIndex: 0
                }} />
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(180deg, rgba(5,18,36,0.55) 0%, rgba(5,18,36,0.8) 70%, var(--color-primary) 100%)',
                    zIndex: 0
                }} />

                <div className="container" style={{ position: 'relative', zIndex: 1, maxWidth: '820px', padding: '0 24px' }}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        style={{ marginBottom: '16px' }}
                    >
                        <Link
                            to="/blog"
                            style={{
                                color: 'var(--color-text-muted)',
                                textDecoration: 'none',
                                fontSize: '14px',
                                fontWeight: 500
                            }}
                        >
                            ← Back to all posts
                        </Link>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.05 }}
                        style={{
                            display: 'inline-block',
                            background: 'rgba(246, 208, 39, 0.1)',
                            color: 'var(--color-accent)',
                            padding: '6px 14px',
                            borderRadius: 'var(--radius-full)',
                            fontSize: '13px',
                            fontWeight: 600,
                            marginBottom: '20px'
                        }}
                    >
                        {post.category}
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.1 }}
                        style={{
                            fontSize: 'clamp(28px, 4.5vw, 48px)',
                            fontWeight: 800,
                            lineHeight: 1.15,
                            marginBottom: '24px',
                            color: '#FFFFFF'
                        }}
                    >
                        {post.title}
                    </motion.h1>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.15 }}
                        style={{
                            display: 'flex',
                            gap: '16px',
                            color: 'var(--color-text-muted)',
                            fontSize: '14px',
                            fontWeight: 500
                        }}
                    >
                        <span>{format(new Date(post.date), 'MMM d, yyyy')}</span>
                        <span>·</span>
                        <span>{post.readTime}</span>
                    </motion.div>
                </div>
            </section>

            <main id="main-content" style={{ flex: 1 }}>
                {/* Featured Image */}
                {post.image && (
                    <div className="container" style={{ maxWidth: '900px', margin: '0 auto -40px', padding: '0 24px', position: 'relative', zIndex: 2 }}>
                        <motion.img
                            src={post.image}
                            alt={post.title}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            style={{
                                width: '100%',
                                aspectRatio: '16 / 9',
                                objectFit: 'cover',
                                borderRadius: 'var(--radius-lg)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                boxShadow: '0 30px 60px rgba(0,0,0,0.4)'
                            }}
                        />
                    </div>
                )}

                {/* Body */}
                <article className="container" style={{ maxWidth: '760px', padding: '72px 24px 80px', margin: '0 auto' }}>
                    {post.body.map((paragraph, i) => (
                        <motion.p
                            key={i}
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: '-50px' }}
                            transition={{ duration: 0.5, delay: i * 0.04 }}
                            style={{
                                color: 'var(--color-text-main)',
                                fontSize: '18px',
                                lineHeight: 1.75,
                                marginBottom: '24px',
                                opacity: 0.9
                            }}
                        >
                            {paragraph}
                        </motion.p>
                    ))}

                    {/* Footer CTA */}
                    <div style={{
                        marginTop: '64px',
                        padding: '32px',
                        background: 'rgba(255, 255, 255, 0.03)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: 'var(--radius-lg)',
                        textAlign: 'center'
                    }}>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '12px' }}>
                            Want this in your business?
                        </h3>
                        <p style={{ color: 'var(--color-text-muted)', marginBottom: '20px', lineHeight: 1.6 }}>
                            We build the systems behind the writing. Talk to us about what you need.
                        </p>
                        <Link
                            to="/contact"
                            style={{
                                display: 'inline-block',
                                padding: '12px 28px',
                                background: 'var(--color-accent)',
                                color: 'var(--color-primary)',
                                fontWeight: 700,
                                borderRadius: 'var(--radius-full)',
                                textDecoration: 'none',
                                fontSize: '15px'
                            }}
                        >
                            Start a project →
                        </Link>
                    </div>
                </article>

                {/* Related */}
                {related.length > 0 && (
                    <section className="container" style={{ padding: '0 24px 80px', maxWidth: '1200px', margin: '0 auto' }}>
                        <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '24px' }}>More from the system</h3>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                            gap: '24px'
                        }}>
                            {related.map((p) => (
                                <Link
                                    key={p.id}
                                    to={`/blog/${p.slug}`}
                                    style={{ textDecoration: 'none', color: 'inherit' }}
                                >
                                    <article style={{
                                        background: 'rgba(255, 255, 255, 0.03)',
                                        border: '1px solid rgba(255, 255, 255, 0.1)',
                                        borderRadius: 'var(--radius-lg)',
                                        overflow: 'hidden',
                                        height: '100%',
                                        transition: 'border-color 0.2s ease, transform 0.2s ease'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.borderColor = 'var(--color-accent)';
                                        e.currentTarget.style.transform = 'translateY(-2px)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                                        e.currentTarget.style.transform = 'translateY(0)';
                                    }}
                                    >
                                        {p.image && (
                                            <img
                                                src={p.image}
                                                alt={p.title}
                                                style={{
                                                    width: '100%',
                                                    aspectRatio: '16 / 9',
                                                    objectFit: 'cover',
                                                    display: 'block'
                                                }}
                                            />
                                        )}
                                        <div style={{ padding: '20px' }}>
                                            <div style={{ color: 'var(--color-accent)', fontWeight: 600, fontSize: '13px', marginBottom: '8px' }}>
                                                {p.category}
                                            </div>
                                            <h4 style={{ fontSize: '1.05rem', fontWeight: 600, marginBottom: '8px', lineHeight: 1.3 }}>
                                                {p.title}
                                            </h4>
                                            <p style={{ color: 'var(--color-text-muted)', fontSize: '14px', lineHeight: 1.5 }}>
                                                {p.excerpt}
                                            </p>
                                        </div>
                                    </article>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}

                <Newsletter />
            </main>
            <Footer />
        </div>
    );
};

export default BlogPost;
