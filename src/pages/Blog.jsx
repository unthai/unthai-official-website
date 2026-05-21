import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Newsletter from '../components/Newsletter';
import { format } from 'date-fns';
import heroBg from '../assets/unthai-ai-automation-bg.webp';
import { fetchPosts } from '../data/postsClient';

const SITE_URL = 'https://unth.ai';

const Blog = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;
        (async () => {
            const data = await fetchPosts();
            if (cancelled) return;
            setPosts(data);
            setLoading(false);
        })();
        return () => { cancelled = true; };
    }, []);

    return (
        <div style={{ background: 'var(--color-primary)', minHeight: '100vh', display: 'flex', flexDirection: 'column', color: 'var(--color-text-main)' }}>
            <Helmet>
                <title>Blog — UNTH.AI</title>
                <meta name="description" content="Deep dives into AI agents, automation architecture, and the future of work." />
                <link rel="canonical" href={`${SITE_URL}/blog`} />
                <meta property="og:type" content="website" />
                <meta property="og:title" content="Blog — UNTH.AI" />
                <meta property="og:description" content="Deep dives into AI agents, automation architecture, and the future of work." />
                <meta property="og:url" content={`${SITE_URL}/blog`} />
            </Helmet>
            <Header />

            {/* Blog Hero */}
            <section style={{
                position: 'relative',
                minHeight: '280px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                paddingTop: '100px',
                paddingBottom: '32px'
            }}>
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundImage: `url(${heroBg})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    opacity: 0.4,
                    zIndex: 0
                }} />
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'radial-gradient(circle at 50% 50%, rgba(5, 18, 36, 0.4), var(--color-primary) 90%)',
                    zIndex: 0
                }} />

                <div className="container" style={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: '1000px' }}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        style={{
                            display: 'inline-block',
                            background: 'rgba(246, 208, 39, 0.1)',
                            color: 'var(--color-accent)',
                            padding: '8px 16px',
                            borderRadius: 'var(--radius-full)',
                            fontSize: '14px',
                            fontWeight: 600,
                            marginBottom: '24px'
                        }}
                    >
                        INSIGHTS & INTELLIGENCE
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.1 }}
                        style={{
                            fontSize: 'clamp(32px, 5vw, 56px)',
                            fontWeight: 800,
                            lineHeight: 1.1,
                            marginBottom: '24px',
                            background: 'linear-gradient(180deg, #FFFFFF 0%, rgba(255,255,255,0.7) 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent'
                        }}
                    >
                        Latest from the <span style={{ color: 'var(--color-accent)', WebkitTextFillColor: 'initial' }}>System</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        style={{
                            fontSize: 'clamp(16px, 2vw, 20px)',
                            color: 'var(--color-text-muted)',
                            maxWidth: '600px',
                            margin: '0 auto'
                        }}
                    >
                        Deep dives into AI agents, automation architecture, and the future of work.
                    </motion.p>
                </div>
            </section>

            <main style={{ flex: 1 }}>
                {/* Blog Grid */}
                <section className="container" style={{ padding: '0 24px 80px' }}>
                    {loading ? (
                        <div style={{ textAlign: 'center', color: 'var(--color-text-muted)', padding: '60px 0' }}>Loading…</div>
                    ) : (
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                            gap: '32px'
                        }}>
                            {posts.map(post => (
                                <Link
                                    key={post.id}
                                    to={`/blog/${post.slug}`}
                                    style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
                                >
                                    <article style={{
                                        background: 'rgba(255, 255, 255, 0.03)',
                                        border: '1px solid rgba(255, 255, 255, 0.1)',
                                        borderRadius: 'var(--radius-lg)',
                                        overflow: 'hidden',
                                        transition: 'transform 0.2s ease, border-color 0.2s ease, background 0.2s ease',
                                        cursor: 'pointer',
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = 'translateY(-4px)';
                                        e.currentTarget.style.borderColor = 'var(--color-accent)';
                                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = 'translateY(0)';
                                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
                                    }}
                                    >
                                        {post.image && (
                                            <div style={{ position: 'relative', overflow: 'hidden' }}>
                                                <img
                                                    src={post.image}
                                                    alt={post.title}
                                                    loading="lazy"
                                                    style={{
                                                        width: '100%',
                                                        aspectRatio: '16 / 9',
                                                        objectFit: 'cover',
                                                        display: 'block'
                                                    }}
                                                />
                                                <div style={{
                                                    position: 'absolute',
                                                    inset: 0,
                                                    background: 'linear-gradient(180deg, transparent 0%, rgba(5,18,36,0.3) 100%)'
                                                }} />
                                            </div>
                                        )}
                                        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', fontSize: '13px' }}>
                                                <span style={{ color: 'var(--color-accent)', fontWeight: 600 }}>{post.category}</span>
                                                <span style={{ color: 'var(--color-text-muted)' }}>{post.readTime}</span>
                                            </div>
                                            <h3 style={{
                                                fontSize: '1.35rem',
                                                fontWeight: 600,
                                                marginBottom: '12px',
                                                lineHeight: 1.3
                                            }}>
                                                {post.title}
                                            </h3>
                                            <p style={{
                                                color: 'var(--color-text-muted)',
                                                lineHeight: 1.6,
                                                marginBottom: '20px',
                                                flex: 1
                                            }}>
                                                {post.excerpt}
                                            </p>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                                                <span style={{
                                                    color: 'var(--color-text-muted)',
                                                    fontWeight: 500,
                                                    fontSize: '13px'
                                                }}>
                                                    {format(new Date(post.date), 'MMM d, yyyy')}
                                                </span>
                                                <span style={{
                                                    color: 'var(--color-accent)',
                                                    fontWeight: 600,
                                                    fontSize: '13px'
                                                }}>
                                                    Read →
                                                </span>
                                            </div>
                                        </div>
                                    </article>
                                </Link>
                            ))}
                        </div>
                    )}
                </section>

                <Newsletter />

            </main>
            <Footer />
        </div>
    );
};

export default Blog;
