"use client"
import { useRouter } from 'next/navigation';


function Home() {
  const router = useRouter();

  return (
    <div className="bg-white">
      <div className="relative flex size-full min-h-screen flex-col group/design-root overflow-x-hidden" style={{ fontFamily: 'Inter, "Noto Sans", sans-serif' }}>
        <div className="layout-container flex h-full grow flex-col">
          <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-gray-200 px-10 py-4">
            <div className="flex items-center gap-4 text-gray-900">
              <svg className="h-8 w-8 text-[#1173d4]" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path d="M42.4379 44C42.4379 44 36.0744 33.9038 41.1692 24C46.8624 12.9336 42.2078 4 42.2078 4L7.01134 4C7.01134 4 11.6577 12.932 5.96912 23.9969C0.876273 33.9029 7.27094 44 7.27094 44L42.4379 44Z" fill="currentColor"></path>
              </svg>
              <h2 className="text-2xl font-bold leading-tight tracking-tight text-gray-900">BlogSmart</h2>
            </div>
            <nav className="flex items-center gap-8">
              <a className="text-base font-medium text-gray-700 hover:text-[#1173d4]" href="#">Features</a>
              <a className="text-base font-medium text-gray-700 hover:text-[#1173d4]" href="#">Pricing</a>
              <a className="text-base font-medium text-gray-700 hover:text-[#1173d4]" href="#">Resources</a>
              <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-md h-10 px-5 bg-[#1173d4] text-white text-base font-bold leading-normal tracking-wide shadow-sm hover:bg-blue-600 transition-colors" onClick={() => router.push('/home')}>
                <span className="truncate" >Get Started</span>
              </button>
            </nav>
          </header>
          <main className="flex-1">
            <section className="relative flex min-h-[60vh] items-center justify-center bg-cover bg-center py-20 text-white" style={{ backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0.7) 100%), url("https://lh3.googleusercontent.com/aida-public/AB6AXuDZc83HdQo3DEHrRywtjoY6m8QBzFM7zmtJ20C6Hel795h2jWyekvpRkx4JDh7HLy4CenmVWUv-1Nv-kMEMtgXd8odXXPpzf4aBEPyD3xKpVhD8xaywSxKkWQb_UWj2mNE7tPL7zFHXRR_WdmTwFpsz8MC67P8DMFPKKPQnYRvCI7I2zA_KGmBK8rhMCTKXnWg1zMGG76slz5dLZDdABf4XNiNIYQ_ZN8kap36nQnxTco-g7TuCmUA7oGq2Jhysd19vKAkpQJ9hQTs")' }}>
              <div className="container mx-auto px-4 text-center">
                <h1 className="text-5xl font-extrabold leading-tight tracking-tight md:text-6xl">Unlock Your Blogging Potential with AI</h1>
                <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-200">BlogSmart is the intelligent blogging platform that empowers you to create high-quality content effortlessly. Leverage the power of AI to generate engaging articles, optimize for SEO, and grow your audience.</p>
                <button className="mt-8 flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-md h-12 px-6 bg-[#1173d4] text-white text-lg font-bold leading-normal tracking-wide shadow-lg hover:bg-blue-600 transition-transform transform hover:scale-105 mx-auto" onClick={() => router.push('/home')}>
                  <span className="truncate">Get Started for Free</span>
                </button>
              </div>
            </section>
            <section className="py-20 bg-gray-50">
              <div className="container mx-auto px-4">
                <div className="text-center">
                  <h2 className="text-4xl font-extrabold tracking-tight text-gray-900">Key Features</h2>
                  <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">BlogSmart offers a suite of AI-powered tools designed to streamline your blogging workflow and maximize your impact.</p>
                </div>
                <div className="mt-16 grid grid-cols-1 gap-12 md:grid-cols-3">
                  <div className="flex flex-col items-center text-center p-6 bg-white rounded-lg shadow-md transition-shadow hover:shadow-xl">
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#1173d4] text-white">
                      <span className="material-symbols-outlined text-4xl">auto_awesome</span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">AI Content Generation</h3>
                    <p className="mt-2 text-base text-gray-600">Generate compelling blog posts, articles, and social media content with our advanced AI writing assistant. Overcome writer's block and create content that resonates with your audience.</p>
                  </div>
                  <div className="flex flex-col items-center text-center p-6 bg-white rounded-lg shadow-md transition-shadow hover:shadow-xl">
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#1173d4] text-white">
                      <span className="material-symbols-outlined text-4xl">search</span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">SEO Optimization</h3>
                    <p className="mt-2 text-base text-gray-600">Optimize your content for search engines with AI-powered keyword research, content analysis, and on-page optimization suggestions. Improve your visibility and reach a wider audience.</p>
                  </div>
                  <div className="flex flex-col items-center text-center p-6 bg-white rounded-lg shadow-md transition-shadow hover:shadow-xl">
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#1173d4] text-white">
                      <span className="material-symbols-outlined text-4xl">groups</span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">Audience Growth Tools</h3>
                    <p className="mt-2 text-base text-gray-600">Engage your readers with interactive elements, track performance metrics, and leverage AI-driven insights to understand your audience better and tailor your content accordingly.</p>
                  </div>
                </div>
              </div>
            </section>
            <section className="py-20">
              <div className="container mx-auto px-4">
                <h2 className="text-center text-4xl font-extrabold tracking-tight text-gray-900">What Our Users Say</h2>
                <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
                  <div className="flex flex-col rounded-lg bg-gray-50 p-8 shadow-sm">
                    <p className="flex-grow text-gray-700">"BlogSmart has revolutionized my content creation process. I can now produce high-quality articles in a fraction of the time, and my audience engagement has skyrocketed!"</p>
                    <div className="mt-6 flex items-center">
                      <img alt="Sarah Chen" className="h-12 w-12 rounded-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBi2wTVHhcuKQb6bH_hc4UBTyapria-leR7fC5wbnb7i2Nh8CfQ1Kw4-RgtZAjV-QLK8lAYl0PCwUSAVs7SmvyAD4nXQ59mwWGJjv6zsiopBdQOz7lSnfQHp3nhqSeAh4NItCF_2_ufpqQtASKBSNWYAEWkAoDZSEwjuJ1ngJ4NHnP5mCSPMNR7c93qNOPjbnonlq_1tq_023PmOyQcUZrfpbhxvJLPPAQshIetlyCmMRCDo00ypIwUAa9aAQu5C7W8IqWqjbWU-fs" />
                      <div className="ml-4">
                        <p className="font-bold text-gray-900">Sarah Chen</p>
                        <p className="text-sm text-gray-600">Marketing Manager</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col rounded-lg bg-gray-50 p-8 shadow-sm">
                    <p className="flex-grow text-gray-700">"As a small business owner, I struggled with blogging consistently. BlogSmart's AI tools have made it easy to create engaging content that drives traffic and generates leads."</p>
                    <div className="mt-6 flex items-center">
                      <img alt="David Lee" className="h-12 w-12 rounded-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDaqVTIBC0wiOoalcP-_ZmipHhPzx3ZBk3tdl8lpK2_YT_CyD_RI40uhZp0eI-x1o2MFNmKPfg2UPE6F49QG5quGhQKvJGtnSqyAWo9cpZRd8bMC77TiUyfuIAO1rqSQSZfJOqahc738AYlkR7zBRQGigBcmjSHPVtXPNHomDZGPhnrfvje1Jx415rSgTgTwQ9IFOkQJVYltVttvU0RtZtI-bmdOFZs0VCopmfIvoxLEqsf5amNoj17SwrGN9wMN9HqEDS8VSTIuZM" />
                      <div className="ml-4">
                        <p className="font-bold text-gray-900">David Lee</p>
                        <p className="text-sm text-gray-600">Small Business Owner</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col rounded-lg bg-gray-50 p-8 shadow-sm">
                    <p className="flex-grow text-gray-700">"BlogSmart's SEO optimization features have been a game-changer for my blog. I've seen a significant increase in organic traffic, and my articles are now ranking higher in search results."</p>
                    <div className="mt-6 flex items-center">
                      <img alt="Emily Rodriguez" className="h-12 w-12 rounded-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD5O0T0sAZGLiin8tNBb29MjL7AJ5cq4-lqS7lVCIbN97RnejEpCKJ0epb4B5dXwW3egOXIKTNvxJ81vK5dPeC0MMrtxICxN3wYaRiEwMPGGti9S9cSzGYwW7zTs9Z3EzNJdM99rcBN2Rgh-mLLxKEG-2rDh-8_qLE2tY-R6WxkacfevpLL6hGPYDjZEQZFzgk9kb6AjcTp2_iIyli51za2aRmr_SC57fG08g6Bh5pDmAVKGj3zXXdQ67B41uaOA7wKB5QDwUQ9yQE" />
                      <div className="ml-4">
                        <p className="font-bold text-gray-900">Emily Rodriguez</p>
                        <p className="text-sm text-gray-600">Content Creator</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </main>
          <footer className="bg-gray-800 text-white">
            <div className="container mx-auto px-4 py-12">
              <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
                <div className="flex flex-col items-center gap-2 md:items-start">
                  <div className="flex items-center gap-2 text-white">
                    <svg className="h-7 w-7 text-white" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                      <path d="M42.4379 44C42.4379 44 36.0744 33.9038 41.1692 24C46.8624 12.9336 42.2078 4 42.2078 4L7.01134 4C7.01134 4 11.6577 12.932 5.96912 23.9969C0.876273 33.9029 7.27094 44 7.27094 44L42.4379 44Z" fill="currentColor"></path>
                    </svg>
                    <h2 className="text-xl font-bold leading-tight tracking-tight">BlogSmart</h2>
                  </div>
                  <p className="text-gray-400">© 2023 BlogSmart. All rights reserved.</p>
                </div>
                <div className="flex gap-6">
                  <a className="text-gray-400 hover:text-white" href="#">Terms of Service</a>
                  <a className="text-gray-400 hover:text-white" href="#">Privacy Policy</a>
                  <a className="text-gray-400 hover:text-white" href="#">Contact Us</a>
                </div>
                <div className="flex gap-4">
                  <a className="text-gray-400 hover:text-white" href="#">
                    <svg aria-hidden="true" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path clipRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" fillRule="evenodd"></path></svg>
                  </a>
                  <a className="text-gray-400 hover:text-white" href="#">
                    <svg aria-hidden="true" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.71v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path></svg>
                  </a>
                  <a className="text-gray-400 hover:text-white" href="#">
                    <svg aria-hidden="true" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm-2 16h-1.5v-7H7v7H5.5V9h1.5v1.28c.4-.73 1.2-1.28 2-1.28 1.42 0 2.5 1.12 2.5 2.5v4.5zm4.5 0h-1.5v-4c0-.55-.45-1-1-1s-1 .45-1 1v4H11v-4.5c0-1.38 1.12-2.5 2.5-2.5s2.5 1.12 2.5 2.5v4.5z" fillRule="evenodd"></path></svg>
                  </a>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  )
}

export default Home