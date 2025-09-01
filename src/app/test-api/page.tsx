'use client'

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import {
	Activity,
	Database,
	Server,
	Link as LinkIcon,
	RefreshCw,
	CheckCircle2,
	XCircle,
	Clock,
	Search,
	ArrowRight,
} from 'lucide-react';

// Define tests here so it's easy to add more later
// Note: All endpoints are relative to the same origin

type TestKey =
	| 'db'
	| 'env'
	| 'institutes'
	| 'people'
	| 'reviews'
	| 'authGetUser';

interface TestItem {
	key: TestKey;
	label: string;
	path: string;
	method?: 'GET' | 'POST';
	description?: string;
	queryHint?: string;
}

const TESTS: TestItem[] = [
	{ key: 'db', label: 'Database Connection', path: '/api/test-db', description: 'Ping MongoDB connection' },
	{ key: 'env', label: 'Environment Check', path: '/api/check-env', description: 'Verify required env vars' },
	{ key: 'institutes', label: 'Institutes API', path: '/api/institute-registration?page=1&limit=1', description: 'Paginated list of institutes' },
	{ key: 'people', label: 'People API', path: '/api/people-registration?page=1&limit=1', description: 'Paginated list of people' },
	{ key: 'reviews', label: 'Reviews API', path: '/api/reviews?page=1&limit=1', description: 'Paginated list of reviews' },
	{ key: 'authGetUser', label: 'Auth: Get User (by email)', path: '/api/auth/get-user?email=', description: 'Lookup user by email', queryHint: 'user@example.com' },
];

interface TestResult {
	status: 'idle' | 'running' | 'success' | 'error';
	ms?: number;
	ok?: boolean;
	message?: string;
	countHint?: string;
	timestamp?: number;
	preview?: string; // pretty JSON preview
}

export default function TestApiPage() {
	const [results, setResults] = useState<Record<TestKey, TestResult>>({
		db: { status: 'idle' },
		env: { status: 'idle' },
		institutes: { status: 'idle' },
		people: { status: 'idle' },
		reviews: { status: 'idle' },
		authGetUser: { status: 'idle' },
	});
	const [runningAll, setRunningAll] = useState(false);
	const [emailQuery, setEmailQuery] = useState('');

	const beautify = (obj: any) => {
		try {
			return JSON.stringify(obj, null, 2).slice(0, 1500);
		} catch {
			return String(obj ?? '');
		}
	};

	const runTest = useCallback(async (test: TestItem) => {
		const start = performance.now();
		setResults(prev => ({ ...prev, [test.key]: { status: 'running' } }));
		try {
			const controller = new AbortController();
			const timeout = setTimeout(() => controller.abort(), 15000);

			const path = test.key === 'authGetUser' && emailQuery
				? `${test.path}${encodeURIComponent(emailQuery)}`
				: test.path;

			const res = await fetch(path, { method: test.method || 'GET', signal: controller.signal });
			clearTimeout(timeout);
			const ms = Math.max(0, Math.round(performance.now() - start));

			let message = `${res.status} ${res.statusText}`;
			let countHint: string | undefined;
			let preview: string | undefined;

			let json: any = undefined;
			try {
				json = await res.json();
				preview = beautify(json);
			} catch (_) {}

			if (json?.success === false && json?.error) message = json.error;
			if (test.key === 'institutes' && json?.pagination) countHint = `total ${json.pagination.totalCount}`;
			if (test.key === 'people' && json?.pagination) countHint = `total ${json.pagination.totalCount}`;
			if (test.key === 'reviews' && json?.pagination) countHint = `total ${json.pagination.totalCount}`;
			if (test.key === 'db' && json) countHint = json?.message || json?.status || undefined;
			if (test.key === 'env' && json) countHint = json?.status || json?.message || undefined;

			setResults(prev => ({
				...prev,
				[test.key]: {
					status: res.ok ? 'success' : 'error',
					ok: res.ok,
					ms,
					message,
					countHint,
					timestamp: Date.now(),
					preview,
				},
			}));
		} catch (e: any) {
			const ms = Math.max(0, Math.round(performance.now() - start));
			const aborted = e?.name === 'AbortError';
			setResults(prev => ({
				...prev,
				[test.key]: {
					status: 'error',
					ok: false,
					ms,
					message: aborted ? 'Request timed out' : (e?.message || 'Request failed'),
					timestamp: Date.now(),
				},
			}));
		}
	}, [emailQuery]);

	const runAll = useCallback(async () => {
		setRunningAll(true);
		try {
			await Promise.all(TESTS.map(t => runTest(t)));
		} finally {
			setRunningAll(false);
		}
	}, [runTest]);

	// Preset helpful email if found in localStorage
	useEffect(() => {
		try {
			const stored = typeof window !== 'undefined' ? window.localStorage.getItem('fp_user_email') : '';
			if (stored && !emailQuery) setEmailQuery(stored);
		} catch {}
	}, [emailQuery]);

	const header = useMemo(() => (
		<div className="flex items-center justify-between flex-wrap gap-3">
			<div className="flex items-center gap-2">
				<Activity className="text-primary" size={18} />
				<h2 className="text-lg font-semibold">API & Database Diagnostics</h2>
			</div>
			<div className="flex items-center gap-2">
				<Button variant="outline" size="sm" onClick={runAll} disabled={runningAll} className="flex items-center gap-2">
					<RefreshCw size={14} className={runningAll ? 'animate-spin' : ''} />
					Run All
				</Button>
			</div>
		</div>
	), [runAll, runningAll]);

	return (
		<div className="min-h-screen bg-background">
			<Navbar />

			<section className="pt-12 pb-10 bg-gradient-to-br from-background via-secondary/20 to-primary/5 relative overflow-hidden">
				<div className="absolute inset-0 opacity-30" style={{
					backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23F42525' fill-opacity='0.03'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")"
				}}></div>
				<div className="container mx-auto mb-6 md:mb-8 px-8 relative">
					<div className="max-w-4xl mx-auto text-center space-y-6">
						<Badge className="bg-primary/10 text-primary border-primary/20 px-4 py-2 inline-flex items-center gap-2">
							<Activity size={16} /> Test APIs
						</Badge>
						<h1 className="text-4xl md:text-6xl font-bold text-foreground leading-tight">
							System <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">Diagnostics</span>
						</h1>
						<p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto">
							Run health checks, verify database connectivity, and test key API endpoints.
						</p>

						<div className="max-w-xl mx-auto grid md:grid-cols-3 gap-3 items-center mb-6 md:mb-8">
							<div className="md:col-span-2 relative">
								<Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
								<Input
									value={emailQuery}
									onChange={(e) => setEmailQuery(e.target.value)}
									placeholder="Optional: user email for auth test"
									className="pl-10 h-10"
								/>
							</div>
							<Button variant="outline" className="h-10" onClick={() => runTest(TESTS.find(t => t.key === 'authGetUser')!)}>
								Run Auth Test
								<ArrowRight size={16} className="ml-2" />
							</Button>
						</div>
					</div>
				</div>
			</section>

			<section className="py-10 mt-4 md:mt-8">
				<div className="container mx-auto mt-8 px-8">
					<Card className="border-primary/20 rounded-xl shadow-sm hover:shadow-md transition-shadow backdrop-blur supports-[backdrop-filter]:bg-background/60">
						<CardContent className="p-6 space-y-6">
							{header}

							<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
								{TESTS.map((t) => {
									const r = results[t.key];
									return (
										<div key={t.key} className="rounded-lg border border-border/60 p-4 hover:border-primary/30 hover:bg-primary/5 transition-colors">
											<div className="flex items-center justify-between">
												<div className="flex items-center gap-2">
													{t.key === 'db' && <Database size={16} className="text-primary" />}
													{t.key === 'env' && <Server size={16} className="text-primary" />}
													{t.key !== 'db' && t.key !== 'env' && <LinkIcon size={16} className="text-primary" />}
													<div className="font-medium text-sm">{t.label}</div>
											</div>
											<div className="text-xs text-muted-foreground">{t.method || 'GET'}</div>
										</div>
										<div className="text-xs text-muted-foreground mt-1">{t.description}</div>

										<div className="flex items-center justify-between mt-3">
											<div className="flex items-center gap-2 text-xs">
												{r?.status === 'success' && <CheckCircle2 size={14} className="text-green-600" />}
												{r?.status === 'error' && <XCircle size={14} className="text-red-600" />}
												{r?.status === 'running' && <RefreshCw size={14} className="animate-spin text-primary" />}
												{r?.status === 'idle' && <Clock size={14} className="text-muted-foreground" />}
												<span className={r?.status === 'error' ? 'text-red-600' : (r?.status === 'success' ? 'text-green-600' : 'text-muted-foreground')}>
													{r?.status === 'idle' && 'Idle'}
													{r?.status === 'running' && 'Running...'}
													{r?.status === 'success' && (r?.countHint ? `OK • ${r.countHint}` : 'OK')}
													{r?.status === 'error' && (r?.message || 'Failed')}
											</span>
											</div>
											<div className="text-xs text-muted-foreground">{typeof r?.ms === 'number' ? `${r.ms} ms` : ''}</div>
										</div>

										{r?.preview && (
											<pre className="mt-3 text-xs bg-muted/50 rounded p-2 overflow-auto max-h-40 whitespace-pre-wrap">
												{r.preview}
											</pre>
										)}
									</div>
								);
								})}
							</div>

						<div className="pt-2 text-xs text-muted-foreground">Tip: Set your email above to test the auth lookup endpoint.</div>
					</CardContent>
					</Card>
				</div>
			</section>

			<section className="pb-16">
				<div className="container mx-auto px-8">
					<div className="text-sm text-muted-foreground">
						Need a broader overview? Visit the{' '}
						<Link href="/sitemap" className="text-primary underline underline-offset-2">Sitemap</Link>
						{' '}to explore all pages.
					</div>
				</div>
			</section>

			<Footer />
		</div>
	);
}
