import Home from './pages/Home';
import Portfolio from './pages/Portfolio';
import Codex from './pages/Codex';
import AIPrompts from './pages/AIPrompts';
import Contact from './pages/Contact';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import AIVideos from './pages/AIVideos';
import Base44 from './pages/Base44';
import KnowledgeSeedBuilder from './pages/KnowledgeSeedBuilder';
import KnowledgeSeeds from './pages/KnowledgeSeeds';
import RAGPlayground from './pages/RAGPlayground';
import Technology from './pages/Technology';
import Services from './pages/Services';
import Manifesto from './pages/Manifesto';
import __Layout from './Layout.jsx';


export const PAGES = {
    "Home": Home,
    "Portfolio": Portfolio,
    "Codex": Codex,
    "AIPrompts": AIPrompts,
    "Contact": Contact,
    "Blog": Blog,
    "BlogPost": BlogPost,
    "AIVideos": AIVideos,
    "Base44": Base44,
    "KnowledgeSeedBuilder": KnowledgeSeedBuilder,
    "KnowledgeSeeds": KnowledgeSeeds,
    "RAGPlayground": RAGPlayground,
    "Technology": Technology,
    "Services": Services,
    "Manifesto": Manifesto,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};
