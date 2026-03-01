'use strict';

module.exports = {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/*{ strapi }*/) { },

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  async bootstrap({ strapi }) {
    try {
      console.log('🚀 Starting Strapi (v5 Compatible) Seeding Process...');

      // 0. Ensure Japanese Locale Exists
      try {
        const localeService = strapi.plugin('i18n').service('locales');
        const locales = await localeService.find();
        const hasJa = locales.find(l => l.code === 'ja-JP');
        if (!hasJa) {
          await localeService.create({
            code: 'ja-JP',
            name: 'Japanese (Japan)',
            isDefault: false,
          });
          console.log('✅ Created ja-JP locale');
        } else {
          console.log('ℹ️ ja-JP locale exists');
        }
      } catch (err) {
        console.warn('⚠️ Could not check/create locales (plugin might not be loaded yet):', err.message);
      }

      // 1. Seed Hero Data
      const heroDoc = await strapi.documents('api::hero.hero').findFirst({ locale: 'en' });
      if (!heroDoc) {
        const newHero = await strapi.documents('api::hero.hero').create({
          data: {
            titleHeader: "UNTHAI: BREAKING LIMITS",
            titleAccent: "THROUGH INTELLIGENCE",
            subtitle: "We don't sell theory. We sell systems, execution, and results.",
            ctaLabel: "Explore Our Expertise",
            locale: 'en',
          },
          status: 'published',
        });
        console.log('✅ Hero data CREATED & PUBLISHED (en)');

        // Add Japanese Translation
        await strapi.documents('api::hero.hero').update({
          documentId: newHero.documentId,
          locale: 'ja-JP',
          data: {
            titleHeader: "UNTHAI: 限界を打ち破る",
            titleAccent: "インテリジェンスで未来を切り拓く",
            subtitle: "私たちは理論を売りません。システム、実行、そして結果を提供します。",
            ctaLabel: "専門知識を見る",
          },
          status: 'published',
        });
        console.log('✅ Hero data ADDED (ja-JP)');
      } else {
        // Check JA
        const heroJa = await strapi.documents('api::hero.hero').findFirst({ locale: 'ja-JP' });
        if (!heroJa) {
          await strapi.documents('api::hero.hero').update({
            documentId: heroDoc.documentId,
            locale: 'ja-JP',
            data: {
              titleHeader: "UNTHAI: 限界を打ち破る",
              titleAccent: "インテリジェンスで未来を切り拓く",
              subtitle: "私たちは理論を売りません。システム、実行、そして結果を提供します。",
              ctaLabel: "専門知識を見る",
            },
            status: 'published',
          });
          console.log('✅ Hero data ADDED (ja-JP) to existing doc');
        } else {
          console.log('ℹ️ Hero data exists (EN & JA)');
        }
      }

      // 2. Seed About Page Data
      const aboutDoc = await strapi.documents('api::about-page.about-page').findFirst({ locale: 'en' });
      if (!aboutDoc) {
        const newAbout = await strapi.documents('api::about-page.about-page').create({
          data: {
            heroTitle: "UNTHAI: BREAKING LIMITS",
            heroSubtitle: "THROUGH INTELLIGENCE",
            heroDescription: "We don't sell theory. We sell systems, execution, and results.",
            missionText: "To empower businesses by combining high-impact AI content with automation-first systems for fast, real-world execution.",
            missionMarket: "Based in Thailand with a global focus, specifically serving the Japan and international French markets.",
            whoWeAreText: "UNTHAI is an AI-powered creative and automation agency designed to scale through technology rather than headcount. We serve digital creators, nightlife entrepreneurs, and solopreneurs who require premium AI assets and seamless backend automation to achieve freedom and leverage.",
            values: [
              { title: 'Leverage', description: 'We build systems that scale.' },
              { title: 'Optionality', description: 'We keep future paths open for your business.' },
              { title: 'Control', description: 'We implement technical precision where it matters most.' }
            ],
            locale: 'en',
          },
          status: 'published',
        });
        console.log('✅ About Page data CREATED & PUBLISHED (en)');

        // Add Japanese Translation
        await strapi.documents('api::about-page.about-page').update({
          documentId: newAbout.documentId,
          locale: 'ja-JP',
          data: {
            heroTitle: "UNTHAI: 限界を打ち破る",
            heroSubtitle: "インテリジェンスで未来を切り拓く",
            heroDescription: "私たちは理論を売りません。システム、実行、そして結果を提供します。",
            missionText: "インパクトのあるAIコンテンツと自動化ファーストのシステムを組み合わせ、迅速な実行力でビジネスをエンパワーします。",
            missionMarket: "タイを拠点に、日本および国際的なフランス市場をターゲットとしています。",
            whoWeAreText: "UNTHAIは、人員ではなくテクノロジーでスケールするように設計されたAI搭載のクリエイティブ＆オートメーションエージェンシーです。私たちは、自由とレバレッジを実現するために、最高品質のAI資産とシームレスなバックエンド自動化を必要とするデジタルクリエイター、ナイトライフ起業家、個人事業主にサービスを提供します。",
            values: [
              { title: 'レバレッジ', description: '拡張性のあるシステムを構築します。' },
              { title: '選択肢', description: 'ビジネスの将来の可能性を広げ続けます。' },
              { title: 'コントロール', description: '最も重要な部分に技術的な正確さを実装します。' }
            ],
          },
          status: 'published',
        });
        console.log('✅ About Page data ADDED (ja-JP)');
      } else {
        const aboutJa = await strapi.documents('api::about-page.about-page').findFirst({ locale: 'ja-JP' });
        if (!aboutJa) {
          await strapi.documents('api::about-page.about-page').update({
            documentId: aboutDoc.documentId,
            locale: 'ja-JP',
            data: {
              heroTitle: "UNTHAI: 限界を打ち破る",
              heroSubtitle: "インテリジェンスで未来を切り拓く",
              heroDescription: "私たちは理論を売りません。システム、実行、そして結果を提供します。",
              missionText: "インパクトのあるAIコンテンツと自動化ファーストのシステムを組み合わせ、迅速な実行力でビジネスをエンパワーします。",
              missionMarket: "タイを拠点に、日本および国際的なフランス市場をターゲットとしています。",
              whoWeAreText: "UNTHAIは、人員ではなくテクノロジーでスケールするように設計されたAI搭載のクリエイティブ＆オートメーションエージェンシーです。私たちは、自由とレバレッジを実現するために、最高品質のAI資産とシームレスなバックエンド自動化を必要とするデジタルクリエイター、ナイトライフ起業家、個人事業主にサービスを提供します。",
              values: [
                { title: 'レバレッジ', description: '拡張性のあるシステムを構築します。' },
                { title: '選択肢', description: 'ビジネスの将来の可能性を広げ続けます。' },
                { title: 'コントロール', description: '最も重要な部分に技術的な正確さを実装します。' }
              ],
            },
            status: 'published',
          });
          console.log('✅ About Page data ADDED (ja-JP) to existing doc');
        } else {
          console.log('ℹ️ About Page data exists (EN & JA)');
        }
      }

      // 3. Seed Global Content
      const globalDoc = await strapi.documents('api::global-content.global-content').findFirst({ locale: 'en' });
      if (!globalDoc) {
        const newGlobal = await strapi.documents('api::global-content.global-content').create({
          data: {
            siteTitle: "UNTHAI",
            footerText: "All Rights Reserved.",
            locale: 'en',
            navigation: [
              { label: "Home", href: "/" },
              { label: "About", href: "/about" },
              { label: "Services", href: "/services" },
            ],
          },
          status: 'published',
        });
        console.log('✅ Global Content CREATED & PUBLISHED (en)');

        // Add Japanese Translation
        await strapi.documents('api::global-content.global-content').update({
          documentId: newGlobal.documentId,
          locale: 'ja-JP',
          data: {
            siteTitle: "UNTHAI",
            footerText: "全著作権所有。",
            navigation: [
              { label: "ホーム", href: "/" },
              { label: "私たちについて", href: "/about" },
              { label: "サービス", href: "/services" },
            ],
          },
          status: 'published',
        });
        console.log('✅ Global Content ADDED (ja-JP)');
      } else {
        const globalJa = await strapi.documents('api::global-content.global-content').findFirst({ locale: 'ja-JP' });
        if (!globalJa) {
          await strapi.documents('api::global-content.global-content').update({
            documentId: globalDoc.documentId,
            locale: 'ja-JP',
            data: {
              siteTitle: "UNTHAI",
              footerText: "全著作権所有。",
              navigation: [
                { label: "ホーム", href: "/" },
                { label: "私たちについて", href: "/about" },
                { label: "サービス", href: "/services" },
              ],
            },
            status: 'published',
          });
          console.log('✅ Global Content ADDED (ja-JP) to existing doc');
        } else {
          console.log('ℹ️ Global Content exists (EN & JA)');
        }
      }

      // 4. Seed Tiered Services
      const servicesCount = await strapi.documents('api::service.service').count({ locale: 'en' });
      // To force replacement of old services, let's look for the new services
      const existing = await strapi.documents('api::service.service').findMany({ locale: 'en' });
      const hasNew = existing.some(s => s.title === 'The Autonomous Store');

      if (!hasNew) {
        console.log('🔄 Cleaning old services and inserting nested tiered services...');
        for (const s of existing) {
          await strapi.documents('api::service.service').delete({ documentId: s.documentId });
        }
        const existingJa = await strapi.documents('api::service.service').findMany({ locale: 'ja-JP' });
        for (const s of existingJa) {
          await strapi.documents('api::service.service').delete({ documentId: s.documentId });
        }

        const newServices = [
          {
            label: "E-commerce",
            title: "The Autonomous Store",
            description: "Replace manual product staging, listing, and syncing with a 100% autonomous AI backend.",
            tiers: [
              { name: "Tier 1: The Visual Catalog", price: "$1,800 / month", deliverables: "20 AI-staged photorealistic product scenes (Higgsfield) + SEO-optimized descriptions in Thai, Japanese, and English (Gemini/ChatGPT)", logic: "Speed-first V1 assets designed for immediate listing deployment." },
              { name: "Tier 2: The Conversion Engine", price: "$4,000 / month", deliverables: "Tier 1 + 5 \"Human-in-the-loop\" Talking Avatars (HeyGen) + Multi-channel inventory syncing (n8n/API)", logic: "Automates the trust-building phase through video and ensures zero-error stock management." },
              { name: "Tier 3: The Autonomous Store", price: "$8,500 / month", deliverables: "Tier 2 + 24/7 AI Sales Concierge (Voice/Chat) + Real-time competitor pricing intelligence (Grok/Perplexity)", logic: "A full \"Mission Control\" setup that scales your store without increasing headcount." }
            ],
            ja: {
              label: "Eコマース",
              title: "自律型ストア",
              description: "手動での商品撮影、リスティング、同期を100%自律型のAIバックエンドに置き換えます。",
              tiers: [
                { name: "Tier 1: ビジュアルカタログ", price: "$1,800 / 月", deliverables: "AIによる写実的な商品シーン20点 (Higgsfield) + SEO最適化された説明文 (タイ語、日本語、英語) (Gemini/ChatGPT)", logic: "即座のリスティング展開を目的とした、スピード重視のV1アセット。" },
                { name: "Tier 2: コンバージョンエンジン", price: "$4,000 / 月", deliverables: "Tier 1 + 話すアバター5名による「Human-in-the-loop」(HeyGen) + マルチチャネル在庫同期 (n8n/API)", logic: "動画を通じた信頼構築フェーズを自動化し、在庫管理のエラーをゼロにします。" },
                { name: "Tier 3: 自律型ストア", price: "$8,500 / 月", deliverables: "Tier 2 + 24時間365日のAIセールスコンシェルジュ (音声/チャット) + 競合他社のリアルタイム価格インテリジェンス (Grok/Perplexity)", logic: "人員を増やすことなくストアを拡張する、完全な「ミッションコントロール」セットアップ。" }
              ]
            }
          },
          {
            label: "Nightlife & Events",
            title: "The Viral Venue",
            description: "Automate the hype and VIP booking process using cinema-quality AI visuals and autonomous receptionists.",
            tiers: [
              { name: "Tier 1: The Weekly Hype", price: "$2,000 / month", deliverables: "4 Cinematic promo clips (Higgsfield \"Indie Sleaze\" style) + 4 High-impact event posters (Lovart)", logic: "Professional-grade creative delivered at weekly speed." },
              { name: "Tier 2: The Viral Venue", price: "$4,500 / month", deliverables: "Tier 1 + 20 AI-generated content drops + Automated guestlist and table booking (ManyChat)", logic: "Continuous social presence paired with instant conversion." },
              { name: "Tier 3: The Midnight Mogul", price: "$10,000 / month", deliverables: "Tier 2 + AI Voice Receptionist for 24/7 VIP reservations + Full real-time event coverage", logic: "Maximum leverage—the venue operates and markets itself autonomously." }
            ],
            ja: {
              label: "ナイトライフ＆イベント",
              title: "バイラルベニュー",
              description: "映画品質のAIビジュアルと自律型受付を使用して、エンタメの告知からVIP予約プロセスまでを自動化します。",
              tiers: [
                { name: "Tier 1: ウィークリーハイプ", price: "$2,000 / 月", deliverables: "シネマティックなプロモクリップ4本 (Higgsfield) + インパクトのあるイベントポスター4枚 (Lovart)", logic: "プロ品質のクリエイティブを毎週のスピードで提供。" },
                { name: "Tier 2: バイラルベニュー", price: "$4,500 / 月", deliverables: "Tier 1 + AI生成コンテンツ20回配信 + 自動化されたゲストリストとテーブル予約 (ManyChat)", logic: "継続的なSNSプレゼンスと即時のコンバージョンを組み合わせます。" },
                { name: "Tier 3: ミッドナイトモーグル", price: "$10,000 / 月", deliverables: "Tier 2 + 24時間365日のVIP予約対応AI音声受付 + リアルタイムのイベントカバレッジ", logic: "最大限のレバレッジ—会場は自律的に運営・マーケティングを行います。" }
              ]
            }
          },
          {
            label: "Real Estate",
            title: "The Global Agent",
            description: "High-velocity AI systems designed to stage luxury properties and qualify global buyers autonomously.",
            tiers: [
              { name: "Tier 1: The Lead Magnet", price: "$2,500 / month", deliverables: "10 Photorealistic 4K staging visuals (Higgsfield) + Automated Facebook/IG lead-gen ads", logic: "Uses Higgsfield \"Amalfi Summer\" or \"Quiet Luxury\" presets to target high-net-worth individuals." },
              { name: "Tier 2: The Autonomous Agent", price: "$5,000 / month", deliverables: "Tier 1 + 24/7 AI Voice Agent for lead qualification, ROI analysis, and tour scheduling", logic: "Replaces manual cold-calling with persistent, data-backed agents that sync directly to your CRM via n8n." },
              { name: "Tier 3: The Luxury Portfolio", price: "$12,000 / month", deliverables: "Tier 2 + Cinematic 3D property \"walkthrough\" videos + Multi-channel \"Mission Control\" (WhatsApp/Email/Voice)", logic: "A full agentic stack that manages the entire top-of-funnel for international brokerage firms." }
            ],
            ja: {
              label: "不動産",
              title: "グローバルエージェント",
              description: "高級物件のステージングとグローバルバイヤーの適格性評価を自律的に行うために設計された、高速AIシステム。",
              tiers: [
                { name: "Tier 1: リードマグネット", price: "$2,500 / 月", deliverables: "AIによる4Kの写実的なステージングビジュアル10点 + 自動化されたFB/IGリードジェネレーション広告", logic: "富裕層をターゲットにしたプリセットを使用。" },
                { name: "Tier 2: 自律型エージェント", price: "$5,000 / 月", deliverables: "Tier 1 + 評価、ROI分析、内見スケジューリング用の24時間AI音声エージェント", logic: "手動のコールドコールを、CRMに直接同期するデータ駆動型エージェントに置き換えます。" },
                { name: "Tier 3: ラグジュアリーポートフォリオ", price: "$12,000 / 月", deliverables: "Tier 2 + シネマティックな3Dの物件「ウォークスルー」動画 + マルチチャネル「ミッションコントロール」(WhatsApp/Email/Voice)", logic: "国際的な仲介会社向けの、ファネル上部全体を管理する完全なエージェントスタック。" }
              ]
            }
          },
          {
            label: "Tourism & Hospitality",
            title: "The Global Guest",
            description: "Multilingual AI concierge systems and cinematic content designed to increase bookings and automate the guest journey.",
            tiers: [
              { name: "Tier 1: The Destination Hype", price: "$2,500 / month", deliverables: "8 Cinematic \"travel-vlog\" style promos (Higgsfield) + 8 Multilingual localized posters (Lovart)", logic: "Focuses on \"Visual-First\" storytelling to capture international tourists in Thailand and Japan." },
              { name: "Tier 2: The Smart Concierge", price: "$5,500 / month", deliverables: "Tier 1 + 24/7 AI Guest Receptionist (Voice/Chat) handling bookings, FAQs, and local recommendations", logic: "Uses Gemini for high-accuracy multilingual support (Thai/JP/EN) to remove language barriers for guests." },
              { name: "Tier 3: The Hospitality Empire", price: "$15,000 / month", deliverables: "Tier 2 + Full automated guest onboarding + Real-time sentiment monitoring + Influencer Avatar \"Tour Guides\"", logic: "Replaces entire front-desk or reservation teams with an autonomous, 24/7 intelligence layer." }
            ],
            ja: {
              label: "観光＆ホスピタリティ",
              title: "グローバルゲスト",
              description: "予約を増やし、ゲストのカスタマージャーニーを自動化するために設計された多言語AIコンシェルジュシステムとシネマティックコンテンツ。",
              tiers: [
                { name: "Tier 1: デスティネーションハイプ", price: "$2,500 / 月", deliverables: "シネマティックな「旅行Vlog」風プロモ8本 + 多言語対応のポスター8枚", logic: "タイや日本の国際的な観光客を獲得するための「ビジュアルファースト」のストーリーテリング。" },
                { name: "Tier 2: スマートコンシェルジュ", price: "$5,500 / 月", deliverables: "Tier 1 + 予約、FAQ、おすすめ情報を処理する24時間365日のAIゲスト受付 (音声/チャット)", logic: "Geminiを使用した高精度の多言語サポートで、ゲストの言語の壁を取り除きます。" },
                { name: "Tier 3: ホスピタリティエンパイア", price: "$15,000 / 月", deliverables: "Tier 2 + 完全に自動化されたゲストオンボーディング + リアルタイムの感情モニタリング + インフルエンサーアバター「ツアーガイド」", logic: "フロントデスクや予約チーム全体を、自律的な24時間インテリジェンス層に置き換えます。" }
              ]
            }
          }
        ];

        for (const service of newServices) {
          const newService = await strapi.documents('api::service.service').create({
            data: {
              label: service.label,
              title: service.title,
              description: service.description,
              tiers: service.tiers,
              locale: 'en'
            },
            status: 'published',
          });

          if (service.ja) {
            await strapi.documents('api::service.service').update({
              documentId: newService.documentId,
              locale: 'ja-JP',
              data: {
                label: service.ja.label,
                title: service.ja.title,
                description: service.ja.description,
                tiers: service.ja.tiers,
              },
              status: 'published'
            });
          }
        }
        console.log('✅ Tiered Services seeded and published (en & ja)');
      } else {
        console.log('ℹ️ Tiered Services exist');
      }

      // 5. Seed Newsletter Data
      const newsletterDoc = await strapi.documents('api::newsletter.newsletter').findFirst({ locale: 'en' });
      if (!newsletterDoc) {
        const newNewsletter = await strapi.documents('api::newsletter.newsletter').create({
          data: {
            title: "Ready to scale your business with AI?",
            subtitle: "Join other forward-thinking entrepreneurs receiving exclusive AI automation strategies.",
            placeholder: "Enter your email address",
            buttonLabel: "Access Intelligence",
            privacyText: "No spam. Unsubscribe at any time.",
            locale: 'en',
          },
          status: 'published',
        });
        console.log('✅ Newsletter data CREATED & PUBLISHED (en)');

        await strapi.documents('api::newsletter.newsletter').update({
          documentId: newNewsletter.documentId,
          locale: 'ja-JP',
          data: {
            title: "AIでビジネスをスケールさせる準備は？",
            subtitle: "独占的なAI自動化戦略を受け取っている、先進的な起業家たちに参加しましょう。",
            placeholder: "メールアドレスを入力",
            buttonLabel: "インテリジェンスにアクセス",
            privacyText: "スパムはありません。いつでも登録解除できます。",
          },
          status: 'published',
        });
        console.log('✅ Newsletter data ADDED (ja-JP)');

      } else {
        const newsletterJa = await strapi.documents('api::newsletter.newsletter').findFirst({ locale: 'ja-JP' });
        if (!newsletterJa) {
          await strapi.documents('api::newsletter.newsletter').update({
            documentId: newsletterDoc.documentId,
            locale: 'ja-JP',
            data: {
              title: "AIでビジネスをスケールさせる準備は？",
              subtitle: "独占的なAI自動化戦略を受け取っている、先進的な起業家たちに参加しましょう。",
              placeholder: "メールアドレスを入力",
              buttonLabel: "インテリジェンスにアクセス",
              privacyText: "スパムはありません。いつでも登録解除できます。",
            },
            status: 'published',
          });
          console.log('✅ Newsletter data ADDED (ja-JP) to existing doc');
        } else {
          console.log('ℹ️ Newsletter data exists (EN & JA)');
        }
      }

      // 6. Seed Lead Form Data
      const leadFormDoc = await strapi.documents('api::lead-form.lead-form').findFirst({ locale: 'en' });
      if (!leadFormDoc) {
        const newLeadForm = await strapi.documents('api::lead-form.lead-form').create({
          data: {
            title: "Ready to Start?",
            subtitle: "Tell us about your project and we'll get back to you with a tailored AI solution.",
            nameLabel: "Your Name",
            emailLabel: "Work Email",
            interestLabel: "Interest",
            messageLabel: "Message",
            buttonLabel: "Send Request",
            successMessage: "Message sent! We'll be in touch soon.",
            errorMessage: "Something wrong. Please try again.",
            sendingMessage: "Sending...",
            locale: 'en',
          },
          status: 'published',
        });
        console.log('✅ Lead Form data CREATED & PUBLISHED (en)');

        await strapi.documents('api::lead-form.lead-form').update({
          documentId: newLeadForm.documentId,
          locale: 'ja-JP',
          data: {
            title: "始める準備はできましたか？",
            subtitle: "プロジェクトについて教えてください。最適なAIソリューションをご提案します。",
            nameLabel: "お名前",
            emailLabel: "仕事用メール",
            interestLabel: "興味のある分野",
            messageLabel: "メッセージ",
            buttonLabel: "リクエストを送信",
            successMessage: "送信されました！すぐにご連絡いたします。",
            errorMessage: "問題が発生しました。もう一度お試しください。",
            sendingMessage: "送信中...",
          },
          status: 'published',
        });
        console.log('✅ Lead Form data ADDED (ja-JP)');

      } else {
        const leadFormJa = await strapi.documents('api::lead-form.lead-form').findFirst({ locale: 'ja-JP' });
        if (!leadFormJa) {
          await strapi.documents('api::lead-form.lead-form').update({
            documentId: leadFormDoc.documentId,
            locale: 'ja-JP',
            data: {
              title: "始める準備はできましたか？",
              subtitle: "プロジェクトについて教えてください。最適なAIソリューションをご提案します。",
              nameLabel: "お名前",
              emailLabel: "仕事用メール",
              interestLabel: "興味のある分野",
              messageLabel: "メッセージ",
              buttonLabel: "リクエストを送信",
              successMessage: "送信されました！すぐにご連絡いたします。",
              errorMessage: "問題が発生しました。もう一度お試しください。",
              sendingMessage: "送信中...",
            },
            status: 'published',
          });
          console.log('✅ Lead Form data ADDED (ja-JP) to existing doc');
        } else {
          console.log('ℹ️ Lead Form data exists (EN & JA)');
        }
      }

      // 7. Set Public Permissions (Magic Step!)
      const publicRole = await strapi.query('plugin::users-permissions.role').findOne({
        where: { type: 'public' },
      });

      if (publicRole) {
        const permissionsToEnable = [
          'api::hero.hero.find',
          'api::hero.hero.findOne',
          'api::about-page.about-page.find',
          'api::about-page.about-page.findOne',
          'api::global-content.global-content.find',
          'api::global-content.global-content.findOne',
          'api::service.service.find',
          'api::service.service.findOne',
          'api::newsletter.newsletter.find',
          'api::newsletter.newsletter.findOne',
          'api::lead-form.lead-form.find',
          'api::lead-form.lead-form.findOne',
        ];

        for (const action of permissionsToEnable) {
          const permissionExists = await strapi.query('plugin::users-permissions.permission').findOne({
            where: {
              role: publicRole.id,
              action: action
            }
          });

          if (!permissionExists) {
            await strapi.query('plugin::users-permissions.permission').create({
              data: {
                action: action,
                role: publicRole.id,
              }
            });
            console.log(`✅ Enabled public permission: ${action}`);
          }
        }
      }

    } catch (error) {
      console.error('❌ Bootstrap error:', error);
    }
  },
};
