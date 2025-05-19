import { useEffect, useRef, useState } from "react";
import { getPageContentByRoute, trackVisit } from "../services/api";
import { createElementFromJson } from "../utils/renderUtils";

const PageRenderer = ({ route }) => {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const startTimeRef = useRef(Date.now());

  useEffect(() => {
    startTimeRef.current = Date.now();

    const fetchContent = async () => {
      setLoading(true);

      try {
        console.log("Appel API en cours pour la route:", route);
        const response = await getPageContentByRoute(route);
        console.log("Réponse API :", response);
        setContent(response);

        if (response.length === 0) {
          throw new Error("Aucun contenu disponible.");
        }
        if (!Array.isArray(response)) {
          throw new Error("Format de réponse invalide.");
        }

        setContent(response);

      } catch (error) {
        console.error("Impossible de charger la page :", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();

    return () => {
      const endTime = Date.now();
      trackVisit({
        pageRoute: route,
        startTime: startTimeRef.current,
        endTime: endTime,
        userId: null, // Remplacer par l'ID utilisateur si disponible
      })
        .then(() => {
          console.log("Visite enregistré par la route:", route);
        })
        .catch(err => {
          console.error("Erreur lors de l'enregistrement de la visite:", err);
        });
    };
  }, [route]);

  if (loading) return <p>Chargement..</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!content || content.length === 0) return <p>pas de contenu disponible </p>;

  return (
    <div>
      {content.map((element, index) => createElementFromJson(element, `root-${index}`))}
    </div>
  );
};

export default PageRenderer;

