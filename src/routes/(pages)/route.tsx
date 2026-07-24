import { createFileRoute, Outlet } from '@tanstack/react-router';
import { MDXProvider } from '@mdx-js/react';
import { ArrowLeft } from 'lucide-react';

import { Link } from '@/core/i18n/navigation';
import { m } from '@/paraglide/messages.js';
import { Footer } from '@/blocks/footer';
import { Header } from '@/blocks/header';
import { mdxComponents } from '@/components/mdx-components';

export const Route = createFileRoute('/(pages)')({
  component: PagesLayout,
});

function PagesLayout() {
  return (
    <div className="bg-background text-foreground flex min-h-screen flex-col">
      <Header />
      <div className="mx-auto w-full max-w-3xl flex-1 px-6 pt-8 md:px-8">
        <Link
          href="/"
          className="text-muted-foreground hover:text-foreground inline-flex items-center gap-2 text-sm font-medium transition-colors"
        >
          <ArrowLeft className="size-4" />
          {m['common.pages.back_to_home']()}
        </Link>
        <div className="pt-6 pb-12 md:pt-8 md:pb-16">
          <MDXProvider components={mdxComponents}>
            <Outlet />
          </MDXProvider>
        </div>
      </div>
      <Footer />
    </div>
  );
}
