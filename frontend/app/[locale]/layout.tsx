import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import ThemeRegistry from '@/components/ThemeRegistry/ThemeRegistry';
import PageLayout from '@/components/Layout/PageLayout';
import { Inter, Montserrat } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });
const montserrat = Montserrat({ subsets: ['latin'], variable: '--font-montserrat' });

export const metadata = {
	title: 'Huqqa Praia - Lounge & Shisha',
	description: 'Premium Shisha Lounge & Bar',
};

export default async function LocaleLayout({
	children,
	params
}: {
	children: React.ReactNode;
	params: Promise<{ locale: string }>;
}) {
	const { locale } = await params;
	const messages = await getMessages();

	return (
		<html lang={locale} className={`${montserrat.variable}`}>
			<body className={inter.className}>
				<NextIntlClientProvider messages={messages}>
					<ThemeRegistry>
						<PageLayout>
							{children}
						</PageLayout>
					</ThemeRegistry>
				</NextIntlClientProvider>
			</body>
		</html>
	);
}
