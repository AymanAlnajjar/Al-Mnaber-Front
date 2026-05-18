import Hero from "@/components/Hero";
import Stats from "@/components/Stats";
import Services from "@/components/Services";
import Projects from "@/components/Projects";
import Clients from "@/components/Clients";
import News from "@/components/News";
import Blogs from "@/components/Blogs";
import FindUs from "@/components/FindUs";
import JsonLd from "@/components/JsonLd";

const API = process.env.NEXT_PUBLIC_API_URL;

async function fetchHomeData() {
  const [slides, stats, services, projects, clients, news, blogs] = await Promise.all([
    fetch(`${API}/hero-slides`, { next: { revalidate: 300 } }).then(r => r.json()).catch(() => []),
    fetch(`${API}/stats`, { next: { revalidate: 300 } }).then(r => r.json()).catch(() => []),
    fetch(`${API}/services`, { next: { revalidate: 300 } }).then(r => r.json()).catch(() => []),
    fetch(`${API}/projects/homepage`, { next: { revalidate: 300 } }).then(r => r.json()).catch(() => []),
    fetch(`${API}/clients`, { next: { revalidate: 300 } }).then(r => r.json()).catch(() => []),
    fetch(`${API}/news/homepage`, { next: { revalidate: 300 } }).then(r => r.json()).catch(() => []),
    fetch(`${API}/blogs/homepage`, { next: { revalidate: 300 } }).then(r => r.json()).catch(() => []),
  ]);
  return { slides, stats, services, projects, clients, news, blogs };
}

export default async function HomePage() {
  const data = await fetchHomeData();
  return (
    <main>
      <JsonLd />
      <Hero slides={data.slides} />
      <Stats stats={data.stats} />
      <Services services={data.services} />
      <Projects projects={data.projects} />
      <Clients clients={data.clients} />
      <News news={data.news} />
      <Blogs blogs={data.blogs} />
      <FindUs />
    </main>
  );
}
