import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
	Truck,
	ArrowRight,
	ShieldCheck,
	Cpu,
	AlertOctagon,
	Terminal as TerminalIcon,
	Menu,
	X,
} from "lucide-react";
import useAuth from "@/hooks/useAuth";

const Landing: React.FC = () => {
	const { user } = useAuth();
	const navigate = useNavigate();
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

	const handleCtaClick = () => {
		if (user) {
			navigate("/dashboard");
		} else {
			navigate("/login");
		}
	};

	return (
		<div className='flex flex-col h-screen bg-canvas text-text-primary font-body relative overflow-x-hidden'>
			{/* Blueprint Dot Grid Background */}
			<div
				className='absolute inset-0 opacity-[0.25] pointer-events-none'
				style={{
					backgroundImage:
						"radial-gradient(circle, #f97316 1px, transparent 1px)",
					backgroundSize: "32px 32px",
				}}
			/>
			{/* Radiant glow effect */}
			<div className='absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-primary/10 blur-[150px] pointer-events-none' />
			<div className='absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-accent-purple/5 blur-[120px] pointer-events-none' />

			{/* Header Navigation */}
			<header className='sticky top-0 z-50 w-full bg-transparent px-4 py-3'>
				<div className='max-w-6xl mx-auto h-14 bg-surface/75 backdrop-blur-md border border-border/60 hover:border-primary/20 transition-colors duration-300 rounded-full px-6 flex items-center justify-between shadow-xl shadow-canvas/40 relative z-50'>
					<div className='flex items-center gap-2.5 group cursor-pointer' onClick={() => navigate("/")}>
						<div className='w-7 h-7 bg-gradient-to-br from-primary to-amber-500 rounded-full flex items-center justify-center shadow shadow-primary/25 group-hover:shadow-primary/45 group-hover:scale-105 transition-all duration-300'>
							<Truck
								className='text-canvas animate-pulse'
								size={13}
							/>
						</div>
						<span className='font-display font-extrabold text-xs md:text-sm tracking-[0.25em] text-text-primary uppercase group-hover:text-primary transition-colors duration-200'>
							Transport<span className='text-primary'>Flow</span>
						</span>
					</div>

					<nav className='hidden md:flex items-center gap-2 text-xs font-semibold'>
						<a
							href='#features'
							className='text-text-primary/70 hover:text-text-primary px-4 py-1.5 rounded-full hover:bg-elevated/70 text-[11px] tracking-[0.22em] font-bold uppercase transition-all duration-300'>
							Features
						</a>
						<a
							href='#architecture'
							className='text-text-primary/70 hover:text-text-primary px-4 py-1.5 rounded-full hover:bg-elevated/70 text-[11px] tracking-[0.22em] font-bold uppercase transition-all duration-300'>
							Architecture
						</a>
						<a
							href='#diagnostics'
							className='text-text-primary/70 hover:text-text-primary px-4 py-1.5 rounded-full hover:bg-elevated/70 text-[11px] tracking-[0.22em] font-bold uppercase transition-all duration-300'>
							Diagnostics
						</a>
					</nav>

					<div className='hidden md:flex items-center'>
						<button
							onClick={handleCtaClick}
							id='header-cta'
							className='flex items-center gap-2 border border-primary/40 bg-primary-muted/20 hover:bg-primary-muted/40 hover:border-primary text-primary hover:text-primary-hover text-[11px] tracking-[0.18em] font-bold px-4 py-2.5 rounded-full transition-all duration-200 active:scale-95 cursor-pointer group'>
							<TerminalIcon size={12} className='opacity-80 group-hover:scale-110 transition-transform duration-200' />
							{user ? "DASHBOARD" : "SIGN IN"}
						</button>
					</div>

					{/* Mobile Menu Toggle */}
					<button
						onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
						className='md:hidden p-2 text-text-secondary hover:text-text-primary hover:bg-surface/50 rounded-full transition-colors cursor-pointer'
						aria-label='Toggle menu'>
						{mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
					</button>
				</div>
			</header>

			{/* Mobile Navigation Drawer */}
			<div
				className={`fixed inset-x-4 top-20 z-40 md:hidden bg-surface/95 backdrop-blur-xl border border-border/80 rounded-3xl transition-all duration-300 ease-in-out origin-top shadow-2xl ${
					mobileMenuOpen
						? "opacity-100 scale-y-100 pointer-events-auto"
						: "opacity-0 scale-y-0 pointer-events-none"
				}`}>
				<nav className='flex flex-col p-6 gap-4 font-bold text-[11px] tracking-[0.22em] uppercase'>
					<a
						href='#features'
						onClick={() => setMobileMenuOpen(false)}
						className='text-text-primary/70 hover:text-text-primary py-3 border-b border-border/40 hover:pl-2 transition-all duration-200'>
						Features
					</a>
					<a
						href='#architecture'
						onClick={() => setMobileMenuOpen(false)}
						className='text-text-primary/70 hover:text-text-primary py-3 border-b border-border/40 hover:pl-2 transition-all duration-200'>
						Architecture
					</a>
					<a
						href='#diagnostics'
						onClick={() => setMobileMenuOpen(false)}
						className='text-text-primary/70 hover:text-text-primary py-3 border-b border-border/40 hover:pl-2 transition-all duration-200'>
						Diagnostics
					</a>
					
					<button
						onClick={() => {
							setMobileMenuOpen(false);
							handleCtaClick();
						}}
						className='w-full mt-2 flex items-center justify-center gap-2 border border-primary/40 bg-primary-muted/20 hover:bg-primary-muted/40 hover:border-primary text-primary text-[11px] tracking-[0.18em] font-bold py-3.5 rounded-full shadow-lg shadow-primary/10 active:scale-95 transition-all cursor-pointer'>
						<TerminalIcon size={12} />
						{user ? "DASHBOARD" : "SIGN IN"}
					</button>
				</nav>
			</div>

			{/* Hero Section */}
			<main className='relative z-10 max-w-6xl mx-auto px-6 py-20 flex-1 flex flex-col items-center text-center'>
				<span className='text-[10px] font-bold tracking-[0.25em] uppercase text-primary bg-primary-muted border border-primary/20 px-3 py-1 rounded-full mb-6'>
					B2B Command Operations
				</span>

				<h1 className='font-display font-bold text-5xl md:text-7xl text-text-primary leading-none tracking-tight max-w-4xl'>
					Mission Control for <br />
					<span className='bg-gradient-to-r from-primary to-amber-500 bg-clip-text text-transparent'>
						Enterprise Logistics
					</span>
				</h1>

				<p className='text-sm md:text-base text-text-secondary max-w-2xl mt-6 leading-relaxed'>
					A high-density fleet diagnostics, automated dispatcher
					queuing, and real-time document compliance engine engineered
					for manufacturing operations.
				</p>

				{/* CTAs */}
				<div className='flex flex-col sm:flex-row gap-4 mt-10'>
					<button
						onClick={handleCtaClick}
						id='hero-primary-cta'
						className='flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-canvas text-sm font-bold px-8 py-3.5 rounded-lg shadow-lg shadow-primary/10 transition-colors duration-150 active:scale-95 cursor-pointer'>
						Launch Command Console <ArrowRight size={16} />
					</button>
					<a
						href='#features'
						className='flex items-center justify-center gap-2 bg-elevated border border-border text-text-primary text-sm font-bold px-8 py-3.5 rounded-lg hover:bg-hover transition-colors duration-150 active:scale-95 cursor-pointer'>
						Explore Blueprint Modules
					</a>
				</div>

				{/* Live Stat Tickers */}
				<div
					id='architecture'
					className='grid grid-cols-1 md:grid-cols-3 gap-4 w-full mt-24 border-t border-b border-border py-8 scroll-mt-24'>
					<div>
						<p className='font-display font-bold text-4xl text-text-primary tabular-nums tracking-tight'>
							+38.4%
						</p>
						<p className='text-[10px] uppercase font-bold text-text-secondary tracking-wider mt-1'>
							Average Utilization Lift
						</p>
					</div>
					<div>
						<p className='font-display font-bold text-4xl text-text-primary tabular-nums tracking-tight'>
							0
						</p>
						<p className='text-[10px] uppercase font-bold text-text-secondary tracking-wider mt-1'>
							Operational Penalties Logged
						</p>
					</div>
					<div>
						<p className='font-display font-bold text-4xl text-text-primary tabular-nums tracking-tight'>
							&lt;100ms
						</p>
						<p className='text-[10px] uppercase font-bold text-text-secondary tracking-wider mt-1'>
							Cascading Dispatch Latency
						</p>
					</div>
				</div>

				{/* Interactive Modules Section */}
				<div
					id='features'
					className='w-full mt-32 scroll-mt-24 text-left space-y-12'>
					<div className='text-center md:text-left'>
						<h2 className='font-display font-semibold text-3xl text-text-primary tracking-tight'>
							Industrial Blueprint Modules
						</h2>
						<p className='text-xs text-text-secondary mt-1'>
							System components designed to drive structural
							visibility across transport networks.
						</p>
					</div>

					<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
						{/* Card 1 */}
						<div className='bg-surface border border-border rounded-xl p-6 hover:border-border/80 transition-colors duration-200 flex flex-col justify-between h-56'>
							<div className='flex justify-between items-start'>
								<div className='w-10 h-10 bg-cyan-500/10 rounded-lg flex items-center justify-center'>
									<Truck
										className='text-accent-cyan'
										size={20}
									/>
								</div>
								<span className='text-[10px] font-mono font-bold text-accent-cyan uppercase tracking-wider bg-cyan-500/5 px-2 py-0.5 rounded'>
									Telematics
								</span>
							</div>
							<div className='space-y-2 mt-4'>
								<h3 className='text-base font-semibold text-text-primary'>
									Real-time Fleet Telematics
								</h3>
								<p className='text-xs text-text-secondary leading-relaxed'>
									Track plate registration numbers as
									monospaced system elements. Auto-calculates
									active mileage, fuel indicators, and driver
									allocation weights.
								</p>
							</div>
							<div className='flex gap-2 mt-4 font-mono text-[10px]'>
								<span className='bg-elevated px-2 py-0.5 rounded border border-border text-text-secondary'>
									MH-12AB-3456
								</span>
								<span className='bg-green-500/10 text-green-400 px-2 py-0.5 rounded'>
									AVAILABLE
								</span>
							</div>
						</div>

						{/* Card 2 */}
						<div className='bg-surface border border-border rounded-xl p-6 hover:border-border/80 transition-colors duration-200 flex flex-col justify-between h-56'>
							<div className='flex justify-between items-start'>
								<div className='w-10 h-10 bg-primary-muted rounded-lg flex items-center justify-center'>
									<Cpu className='text-primary' size={20} />
								</div>
								<span className='text-[10px] font-mono font-bold text-primary uppercase tracking-wider bg-primary/5 px-2 py-0.5 rounded'>
									Dispatch
								</span>
							</div>
							<div className='space-y-2 mt-4'>
								<h3 className='text-base font-semibold text-text-primary'>
									Automated Route Dispatching
								</h3>
								<p className='text-xs text-text-secondary leading-relaxed'>
									Step-progression logistics workflows.
									Cascadings update asset state across both
									vehicle and driver profiles instantly upon
									route execution.
								</p>
							</div>
							<div className='flex gap-2 mt-4 font-mono text-[10px]'>
								<span className='text-text-secondary'>
									Scheduled &rarr; Loading &rarr; Dispatched
								</span>
							</div>
						</div>

						{/* Card 3 */}
						<div className='bg-surface border border-border rounded-xl p-6 hover:border-border/80 transition-colors duration-200 flex flex-col justify-between h-56'>
							<div className='flex justify-between items-start'>
								<div className='w-10 h-10 bg-red-500/10 rounded-lg flex items-center justify-center'>
									<AlertOctagon
										className='text-danger'
										size={20}
									/>
								</div>
								<span className='text-[10px] font-mono font-bold text-danger uppercase tracking-wider bg-red-500/5 px-2 py-0.5 rounded'>
									Compliance
								</span>
							</div>
							<div className='space-y-2 mt-4'>
								<h3 className='text-base font-semibold text-text-primary'>
									Expiry Warning Gateways
								</h3>
								<p className='text-xs text-text-secondary leading-relaxed'>
									Avoid legal gridlocks. Integrated calendar
									warning monitors trigger red alerts for key
									certificates within 7 days, warning admins
									dynamically.
								</p>
							</div>
							<div className='flex gap-2 mt-4 font-mono text-[10px]'>
								<span className='bg-danger/10 text-danger px-2 py-0.5 rounded'>
									CRITICAL EXPIRY ALERT
								</span>
							</div>
						</div>

						{/* Card 4 */}
						<div className='bg-surface border border-border rounded-xl p-6 hover:border-border/80 transition-colors duration-200 flex flex-col justify-between h-56'>
							<div className='flex justify-between items-start'>
								<div className='w-10 h-10 bg-violet-500/10 rounded-lg flex items-center justify-center'>
									<ShieldCheck
										className='text-accent-purple'
										size={20}
									/>
								</div>
								<span className='text-[10px] font-mono font-bold text-accent-purple uppercase tracking-wider bg-violet-500/5 px-2 py-0.5 rounded'>
									Fulfillment
								</span>
							</div>
							<div className='space-y-2 mt-4'>
								<h3 className='text-base font-semibold text-text-primary'>
									Proof of Delivery Verification
								</h3>
								<p className='text-xs text-text-secondary leading-relaxed'>
									Real-time signature collections, recipient
									records, and instant failed delivery
									reschedule forms to close the verification
									loops.
								</p>
							</div>
							<div className='flex gap-2 mt-4 font-mono text-[10px]'>
								<span className='bg-green-500/10 text-green-400 px-2 py-0.5 rounded'>
									POD SECURED
								</span>
							</div>
						</div>
					</div>
				</div>

				{/* Diagnostics Console Panel */}
				<div
					id='diagnostics'
					className='w-full mt-32 scroll-mt-24 text-left space-y-6'>
					<div className='text-center md:text-left'>
						<h2 className='font-display font-semibold text-3xl text-text-primary tracking-tight'>
							Diagnostics CLI Simulator
						</h2>
						<p className='text-xs text-text-secondary mt-1'>
							Interact with our real-time database state simulator
							demonstrating MongoDB operations.
						</p>
					</div>

					<div className='w-full bg-surface border border-border rounded-xl p-5 font-mono text-xs shadow-2xl relative overflow-hidden flex flex-col gap-3'>
						<div className='absolute top-0 left-0 right-0 h-9 bg-elevated border-b border-border px-4 flex items-center justify-between'>
							<div className='flex items-center gap-2'>
								<span className='w-3 h-3 rounded-full bg-danger/70' />
								<span className='w-3 h-3 rounded-full bg-warning/70' />
								<span className='w-3 h-3 rounded-full bg-success/70' />
							</div>
							<span className='text-[10px] text-text-tertiary font-bold tracking-wider flex items-center gap-1.5 uppercase'>
								<TerminalIcon size={12} /> transportflow_cli
							</span>
						</div>

						<div className='pt-8 space-y-3'>
							<p className='text-text-secondary'>
								<span className='text-primary font-bold'>
									admin@transportflow:~$
								</span>{" "}
								./diagnose_fleet --active
							</p>
							<div className='space-y-1 pl-4 text-[11px] text-text-secondary bg-canvas/40 p-3 rounded border border-border'>
								<p className='text-success'>
									[OK] Established database connection to
									MongoDB cluster.
								</p>
								<p className='text-success'>
									[OK] Verified JWT auth schemas: admin,
									manager, dispatcher.
								</p>
								<p className='text-text-primary'>&#123;</p>
								<p className='pl-4'>"fleetStatus": "ONLINE",</p>
								<p className='pl-4'>"activeTrips": 8,</p>
								<p className='pl-4'>"pendingOrders": 14,</p>
								<p className='pl-4'>
									"compliancePermits": "ALL_VERIFIED"
								</p>
								<p className='text-text-primary'>&#125;</p>
							</div>
							<p className='text-text-tertiary'>
								# System diagnostics completed in 14.5ms.
							</p>
						</div>
					</div>
				</div>
			</main>

			{/* Footer */}
			<footer className='relative z-10 border-t border-border bg-surface py-10 w-full'>
				{" "}
				<div className='max-w-6xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center text-xs text-text-secondary gap-4'>
					<div className='flex items-center gap-2'>
						<div className='w-6 h-6 bg-primary rounded flex items-center justify-center shrink-0'>
							<Truck className='text-canvas' size={13} />
						</div>
						<span className='font-display font-semibold tracking-tight text-text-primary text-sm'>
							TransportFlow
						</span>
					</div>
					<p>
						© 2026 TransportFlow. Industrial precision transport
						console. All rights reserved.
					</p>
				</div>
			</footer>
		</div>
	);
};

export default Landing;
