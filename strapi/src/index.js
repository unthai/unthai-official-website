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

      // 4. Seed Services
      const servicesCount = await strapi.documents('api::service.service').count({ locale: 'en' });
      if (servicesCount === 0) {
        const services = [
          {
            label: "CONTENT CREATION",
            title: "AI Content Engine",
            description: "Fast, cinema-quality videos and visuals for your brand.",
            features: [{ text: "Social media ads" }, { text: "Talking avatars" }, { text: "Marketing flyers" }],
            ja: {
              label: "コンテンツ制作",
              title: "AIコンテンツエンジン",
              description: "ブランドのための、高速で映画品質の動画とビジュアル。",
              features: [{ text: "SNS広告" }, { text: "トーキングアバター" }, { text: "マーケティングチラシ" }]
            }
          },
          {
            label: "SMART ASSISTANTS",
            title: "Autonomous Agents",
            description: "AI assistants that work 24/7 to handle tasks for you.",
            features: [{ text: "Customer support bots" }, { text: "Sales assistants" }, { text: "Internal helpers" }],
            ja: {
              label: "スマートアシスタント",
              title: "自律型エージェント",
              description: "24時間365日、あなたのタスクを処理するAIアシスタント。",
              features: [{ text: "カスタマーサポートボット" }, { text: "セールスアシスタント" }, { text: "社内ヘルパー" }]
            }
          },
          {
            label: "AUTOMATION",
            title: "Workflow Automation",
            description: "Connect your apps to save time and stop doing manual work.",
            features: [{ text: "Custom workflows" }, { text: "App connections" }, { text: "Sync CRM data" }],
            ja: {
              label: "自動化",
              title: "ワークフロー自動化",
              description: "アプリを連携させて時間を節約し、手作業をなくします。",
              features: [{ text: "カスタムワークフロー" }, { text: "アプリ連携" }, { text: "CRMデータ同期" }]
            }
          },
          {
            label: "BULK CREATION",
            title: "Creative Automation",
            description: "Generate hundreds of branded designs in seconds.",
            features: [{ text: "Brand kits" }, { text: "Social media posts" }, { text: "Layout templates" }],
            ja: {
              label: "大量生成",
              title: "クリエイティブ自動化",
              description: "ブランドデザインを数秒で数百枚生成します。",
              features: [{ text: "ブランドキット" }, { text: "SNS投稿" }, { text: "レイアウトテンプレート" }]
            }
          },
          {
            label: "GROWTH ACCELERATION",
            title: "AI Growth Strategy",
            description: "Find new customers and reach out to them automatically.",
            features: [{ text: "Lead finding" }, { text: "Automated emails" }, { text: "Market analysis" }],
            ja: {
              label: "成長加速",
              title: "AI成長戦略",
              description: "新規顧客を見つけ、自動的にアプローチします。",
              features: [{ text: "リード発掘" }, { text: "自動メール送信" }, { text: "市場分析" }]
            }
          },
          {
            label: "SMART RECEPTIONISTS",
            title: "AI Voice Intelligence",
            description: "AI that talks like a human to answer calls and make sales.",
            features: [{ text: "Automated calling" }, { text: "24/7 Phone support" }, { text: "Human-like voice" }],
            ja: {
              label: "スマート受付",
              title: "AI音声インテリジェンス",
              description: "人間のように話すAIが電話に応対し、セールスを行います。",
              features: [{ text: "自動通話" }, { text: "24時間電話対応" }, { text: "人間のような声" }]
            }
          }
        ];

        for (const service of services) {
          const newService = await strapi.documents('api::service.service').create({
            data: {
              label: service.label,
              title: service.title,
              description: service.description,
              features: service.features,
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
                features: service.ja.features,
              },
              status: 'published'
            });
          }
        }
        console.log('✅ Services seeded and published (en & ja)');
      } else {
        console.log('ℹ️ Services exist');
        // Retroactive check for JA services
        const existingServices = await strapi.documents('api::service.service').findMany({ locale: 'en' });
        for (const serviceDoc of existingServices) {
          const jaService = await strapi.documents('api::service.service').findFirst({
            filters: { documentId: serviceDoc.documentId },
            locale: 'ja-JP'
          });
          if (!jaService) {
            // Simple keyword matching for translation
            let jaData = {};
            if (serviceDoc.title.includes("Content")) jaData = { label: "コンテンツ制作", title: "AIコンテンツエンジン", description: "ブランドのための、高速で映画品質の動画とビジュアル。", features: [{ text: "SNS広告" }, { text: "トーキングアバター" }, { text: "マーケティングチラシ" }] };
            else if (serviceDoc.title.includes("Agents")) jaData = { label: "スマートアシスタント", title: "自律型エージェント", description: "24時間365日、あなたのタスクを処理するAIアシスタント。", features: [{ text: "カスタマーサポートボット" }, { text: "セールスアシスタント" }, { text: "社内ヘルパー" }] };
            else if (serviceDoc.title.includes("Workflow")) jaData = { label: "自動化", title: "ワークフロー自動化", description: "アプリを連携させて時間を節約し、手作業をなくします。", features: [{ text: "カスタムワークフロー" }, { text: "アプリ連携" }, { text: "CRMデータ同期" }] };
            else if (serviceDoc.title.includes("Creative")) jaData = { label: "大量生成", title: "クリエイティブ自動化", description: "ブランドデザインを数秒で数百枚生成します。", features: [{ text: "ブランドキット" }, { text: "SNS投稿" }, { text: "レイアウトテンプレート" }] };
            else if (serviceDoc.title.includes("Growth")) jaData = { label: "成長加速", title: "AI成長戦略", description: "新規顧客を見つけ、自動的にアプローチします。", features: [{ text: "リード発掘" }, { text: "自動メール送信" }, { text: "市場分析" }] };
            else if (serviceDoc.title.includes("Voice")) jaData = { label: "スマート受付", title: "AI音声インテリジェンス", description: "人間のように話すAIが電話に応対し、セールスを行います。", features: [{ text: "自動通話" }, { text: "24時間電話対応" }, { text: "人間のような声" }] };

            if (jaData.title) {
              await strapi.documents('api::service.service').update({
                documentId: serviceDoc.documentId,
                locale: 'ja-JP',
                data: jaData,
                status: 'published'
              });
              console.log(`✅ Added JA translation to Service: ${serviceDoc.title}`);
            }
          }
        }
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
