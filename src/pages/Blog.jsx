import React from 'react';
import { motion } from 'framer-motion';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Newsletter from '../components/Newsletter';
import { differenceInDays, format } from 'date-fns';
import heroBg from '../assets/unthai-ai-automation-bg.png';

const Blog = () => {
    const posts = [
        {
            id: 1,
            title: "The Rise of Autonomous AI Agents in Enterprise",
            excerpt: "How intelligent agents are transforming business workflows from reactive to proactive systems.",
            date: "2025-10-24",
            category: "AI Strategy",
            readTime: "5 min read"
        },
        {
            id: 2,
            title: "Generative UI: Beyond Static Interfaces",
            excerpt: "Exploring the shift towards fluid, context-aware user interfaces generated on the fly by AI.",
            date: "2025-11-02",
            category: "Design",
            readTime: "4 min read"
        },
        {
            id: 3,
            title: "Optimizing n8n Workflows for Scale",
            excerpt: "Best practices for building robust, error-tolerant automation pipelines that handle thousands of executions.",
            date: "2025-11-15",
            category: "Automation",
            readTime: "8 min read"
        },
        {
            id: 4,
            title: "The Future of Low-Code Development with AI",
            excerpt: "How AI-assisted coding is bridging the gap between no-code simplicity and pro-code power.",
            date: "2025-11-20",
            category: "Development",
            readTime: "6 min read"
        },
        {
            id: 5,
            title: "Building Resilient Data Pipelines",
            excerpt: "Architectural patterns for ensuring data integrity and availability in modern cloud environments.",
            date: "2025-11-28",
            category: "Data Engineering",
            readTime: "7 min read"
        },
        {
            id: 6,
            title: "From Chatbots to Digital Employees",
            excerpt: "The evolution of conversational interfaces into fully autonomous digital workers capable of complex tasks.",
            date: "2025-12-05",
            category: "AI Workforce",
            readTime: "5 min read"
        }
    ];

    return (
        <div style={{ background: 'var(--color-primary)', minHeight: '100vh', display: 'flex', flexDirection: 'column', color: 'var(--color-text-main)' }}>
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
                {/* Background Effect - Full Width Image with Overlay */}
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
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                        gap: '32px'
                    }}>
                        {posts.map(post => (
                            <article key={post.id} style={{
                                background: 'rgba(255, 255, 255, 0.03)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                borderRadius: 'var(--radius-lg)',
                                overflow: 'hidden',
                                transition: 'transform 0.2s ease, border-color 0.2s ease',
                                cursor: 'pointer'
                            }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-4px)';
                                    e.currentTarget.style.borderColor = 'var(--color-accent)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                                }}
                            >
                                <div style={{ padding: '32px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', fontSize: '14px' }}>
                                        <span style={{ color: 'var(--color-accent)', fontWeight: 600 }}>{post.category}</span>
                                        <span style={{ color: 'var(--color-text-muted)' }}>{post.readTime}</span>
                                    </div>
                                    <h3 style={{
                                        fontSize: '1.5rem',
                                        fontWeight: 600,
                                        marginBottom: '16px',
                                        lineHeight: 1.3
                                    }}>
                                        {post.title}
                                    </h3>
                                    <p style={{
                                        color: 'var(--color-text-muted)',
                                        lineHeight: 1.6,
                                        marginBottom: '24px'
                                    }}>
                                        {post.excerpt}
                                    </p>
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        color: 'var(--color-text-main)',
                                        fontWeight: 500,
                                        fontSize: '14px'
                                    }}>
                                        Read Article setup &rarr;
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                </section>

                <Newsletter />

            </main>
            <Footer />
        </div>
    );
};

export default Blog;
