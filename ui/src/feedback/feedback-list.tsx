import {useEffect, useState, useRef} from "react";
import {Feedback, feedbacksQuery} from "./api.ts";


export default function FeedbackList() {
  const [page, setPage] = useState(1);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([])
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());
  const [numPages, setNumPages] = useState<number>(1);
  const [truncatedItems, setTruncatedItems] = useState<Set<number>>(new Set());
  const textRefs = useRef<{ [key: number]: HTMLParagraphElement }>({});

  useEffect(() => {
    feedbacksQuery(page, 10).then((result) => {
      setFeedbacks(result.feedbacks.values);
      setNumPages(result.feedbacks.numPages);
    });
  }, [page]);

  useEffect(() => {
    feedbacks.forEach((feedback) => {
      const element = textRefs.current[feedback.id];
      if (element) {
        const isTruncated = element.scrollHeight > element.clientHeight;
        setTruncatedItems(prevItems => {
          const newTruncatedItems = new Set(prevItems);
          if (isTruncated) {
            newTruncatedItems.add(feedback.id);
          } else {
            newTruncatedItems.delete(feedback.id);
          }
          return newTruncatedItems;
        });
      }
    });
  }, [feedbacks]);

  return (
    <div className="max-w-3xl min-w-96 mx-auto space-y-4">
      <h1 className="text-2xl font-semibold">Feedback</h1>
      <div className="flex flex-col gap-10">
        {feedbacks.map((feedback) => (
          <div key={feedback.id}>
            <p className="text-gray-400">Original: </p>
          <div
            key={feedback.id}
            className="bg-slate-700 bg-opacity-20 hover:bg-opacity-30 cursor-pointer rounded-lg py-2 px-4 text-left"
          >
            <div>
              <p
                ref={(el) => { textRefs.current[feedback.id] = el as HTMLParagraphElement; }}
                className={`text-red-300 ${!expandedItems.has(feedback.id) && 'line-clamp-2'}`}
              >
                {feedback.text}
              </p>
              {truncatedItems.has(feedback.id) && (
                <button
                  className="text-sm text-blue-400 hover:underline mt-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    setExpandedItems(prevItems => {
                      const newExpandedItems = new Set(prevItems);
                      if (newExpandedItems.has(feedback.id)) {
                        newExpandedItems.delete(feedback.id);
                      } else {
                        newExpandedItems.add(feedback.id);
                      }
                      return newExpandedItems;
                    });
                  }}
                >
                  {expandedItems.has(feedback.id) ? "See less" : "See more"}
                </button>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-2 text-sm text-gray-300">
            <p className="text-gray-400 mt-4">Highlights: </p>
            <ul>
              {
                feedback.highlights.map((highlight) => (
                  <li
                    key={highlight.id}
                    className="list-disc ml-8"
                  >
                    {highlight.summary}
                  </li>
                ))
              }
            </ul>
          </div>
        </div>
        ))}
      </div>
      {
        numPages > 0 ? (
          <div className="flex justify-center gap-4 mt-4">
            {page > 1 && (
              <button
                onClick={() => setPage(page - 1)}
                className="text-sm text-blue-500 hover:bg-blue-500 hover:text-white border border-blue-500 rounded px-4 py-2"
              >
                Previous
              </button>
            )}
            
            <span className="text-sm text-gray-400 py-2">
              Page {page} of {numPages}
            </span>

            {page < numPages && (
              <button
                onClick={() => setPage(page + 1)} 
                className="text-sm text-blue-500 hover:bg-blue-500 hover:text-white border border-blue-500 rounded px-4 py-2"
              >
                Next
              </button>
            )}
          </div>
        ) : (
          <div className="flex justify-center gap-4 mt-4">
            <p className="text-sm text-gray-400">No feedbacks found</p>
          </div>
        )
      }
    </div>
  );
}
