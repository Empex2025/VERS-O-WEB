import { useState } from 'react';
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal, ImageIcon } from 'lucide-react';
import { Avatar } from '../ui/Avatar';
import { ShareModal } from './ShareModal';
import { currentUser, type Post } from '../../data/social';
import { socialService } from '../../services/socialService';
import { useAuthStore } from '../../store/useAuthStore';

interface Comment {
    author: string;
    text: string;
}

export function PostCard({ post }: { post: Post }) {
    const [sharing, setSharing] = useState(false);
    const [liked, setLiked] = useState(false);
    const [showComments, setShowComments] = useState(false);
    const [comments, setComments] = useState<Comment[]>([]);
    const [draft, setDraft] = useState('');
    const userId = useAuthStore((s) => s.user?.id);
    const postId = Number(post.id);

    const toggleLike = () => {
        setLiked((v) => !v);
        // Persiste na API (otimista — ignora falha no modo demo)
        if (Number.isFinite(postId) && userId) {
            socialService.likePost(postId, userId).catch(() => {});
        }
    };

    const addComment = () => {
        const text = draft.trim();
        if (!text) return;
        setComments((prev) => [...prev, { author: currentUser.name, text }]);
        setDraft('');
        if (Number.isFinite(postId) && userId) {
            socialService.comment(postId, userId, text).catch(() => {});
        }
    };

    return (
        <article className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-5">
            {/* Cabeçalho */}
            <header className="flex items-start gap-3">
                <Avatar name={post.author.name} size={44} />
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-900 flex items-center gap-1">
                        {post.author.name}
                        {post.author.verified && <span className="text-[#407BFF] text-xs">✔</span>}
                    </p>
                    <p className="text-xs text-gray-400">
                        {post.location ? `${post.location} · ` : ''}{post.time}
                    </p>
                </div>
                <button className="text-gray-400 hover:text-gray-600 p-1"><Bookmark size={18} /></button>
                <button className="text-gray-400 hover:text-gray-600 p-1"><MoreHorizontal size={18} /></button>
            </header>

            {/* Texto */}
            <p className="text-sm text-gray-700 mt-3 leading-relaxed">
                {post.text} <button className="text-[#407BFF] font-semibold hover:underline">Ver mais</button>
            </p>

            {/* Mídia */}
            {post.hasImage && (
                <div className="mt-3 rounded-xl bg-gray-100 aspect-[16/10] flex items-center justify-center text-gray-300">
                    <ImageIcon size={48} />
                </div>
            )}

            {/* Ações */}
            <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-5 text-gray-600">
                    <button
                        onClick={toggleLike}
                        className={`flex items-center gap-1.5 transition-colors ${liked ? 'text-rose-500' : 'hover:text-rose-500'}`}
                    >
                        <Heart size={20} className={liked ? 'fill-rose-500' : ''} />
                        <span className="text-xs font-semibold">{post.likes}</span>
                    </button>
                    <button
                        onClick={() => setShowComments((v) => !v)}
                        className={`flex items-center gap-1.5 transition-colors ${showComments ? 'text-[#407BFF]' : 'hover:text-[#407BFF]'}`}
                    >
                        <MessageCircle size={20} className={showComments ? 'fill-[#407BFF]' : ''} />
                        {comments.length > 0 && <span className="text-xs font-semibold">{comments.length}</span>}
                    </button>
                    <button onClick={() => setSharing(true)} className="flex items-center gap-1.5 hover:text-[#407BFF] transition-colors">
                        <Send size={20} />
                    </button>
                </div>
            </div>

            <p className="text-xs text-gray-400 mt-2">
                {post.comments} · {post.shares}
            </p>

            {/* Seção de comentários */}
            {showComments && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                    {/* Comentários já publicados */}
                    {comments.map((c, i) => (
                        <div key={i} className="flex items-start gap-2 mb-3">
                            <Avatar name={c.author} size={32} />
                            <div className="bg-[#F3F4F6] rounded-2xl px-3 py-2 max-w-[85%]">
                                <p className="text-xs font-bold text-gray-900">{c.author}</p>
                                <p className="text-sm text-gray-700 break-words">{c.text}</p>
                            </div>
                        </div>
                    ))}

                    {/* Campo de novo comentário */}
                    <div className="flex items-start gap-2">
                        <Avatar name={currentUser.name} size={32} />
                        <div className="flex-1">
                            <p className="text-xs font-bold text-gray-900 mb-1">{currentUser.name}</p>
                            <div className="flex items-center gap-2 bg-[#F3F4F6] rounded-full pl-3 pr-1 py-1">
                                <input
                                    value={draft}
                                    onChange={(e) => setDraft(e.target.value)}
                                    onKeyDown={(e) => { if (e.key === 'Enter') addComment(); }}
                                    placeholder="Escreva um comentário..."
                                    className="flex-1 bg-transparent text-sm text-gray-700 outline-none placeholder-gray-400 py-1"
                                />
                                <button
                                    onClick={addComment}
                                    disabled={!draft.trim()}
                                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                                        draft.trim() ? 'bg-[#407BFF] text-white hover:bg-blue-600' : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                    }`}
                                >
                                    <Send size={15} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <ShareModal open={sharing} onClose={() => setSharing(false)} />
        </article>
    );
}
