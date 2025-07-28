import { useEffect, useState } from "react";
import { getUserLikes } from "@controllers/blogLikes/blogLikes";
import { useAuthStore } from "@stores/authStore";
import { ArrowCard } from "@components/ArrowCard/ArrowCard";

interface LikeItem {
  id: number;
  page_url: string;
  created_at: string;
}

export const UserLikesList = () => {
  const [likes, setLikes] = useState<LikeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    const fetchLikes = async () => {
      if (!isAuthenticated) {
        setError("Debes iniciar sesión para ver tus likes");
        setLoading(false);
        return;
      }

      try {
        const response = await getUserLikes();
        if (response.success) {
          setLikes(response.data);
          setError(null);
        } else {
          setError("Error al cargar los likes");
        }
      } catch (err) {
        setError("Error al cargar los likes");
        console.error("Error fetching likes:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLikes();
  }, [isAuthenticated]);

  console.log(likes);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <span className="loading loading-spinner loading-md"></span>
        <span className="ml-2">Cargando tus likes...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-error">
        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>{error}</span>
      </div>
    );
  }

  if (likes.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-6xl mb-4">❤️</div>
        <h3 className="text-lg font-semibold mb-2">No tienes likes aún</h3>
        <p className="text-stone-600 dark:text-stone-400">
          Cuando des like a un post, aparecerá aquí
        </p>
        <a href="/" className="btn btn-primary btn-sm mt-4">
          Explorar posts
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <ul className="flex flex-col gap-4">
        {likes.map(post => (
          <li key={post.id}>
            <ArrowCard title={post.page_url.replaceAll("_", " ")} slug={post.page_url} />
          </li>
        ))}
      </ul>
    </div>
  );
};