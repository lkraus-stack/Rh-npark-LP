import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Check, X } from "lucide-react";
import { type ReactNode, useEffect, useId, useRef } from "react";

export interface DetailOverlayDetail {
  title: string;
  eyebrow: string;
  intro: string;
  image: string;
  facts: string[];
  benefits: string[];
}

export interface DetailOverlayProps<TDetail extends DetailOverlayDetail = DetailOverlayDetail> {
  detail: TDetail | null;
  onClose: () => void;
  onPrimaryAction?: (detail: TDetail) => void;
  primaryActionLabel?: string;
  label?: ReactNode;
  closeLabel?: string;
}

export function DetailOverlay<TDetail extends DetailOverlayDetail = DetailOverlayDetail>({
  detail,
  onClose,
  onPrimaryAction,
  primaryActionLabel = "In Anfrage übernehmen",
  label = "Luxury Line Detail",
  closeLabel = "Detailfenster schließen",
}: DetailOverlayProps<TDetail>) {
  const titleId = useId();
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const onCloseRef = useRef(onClose);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!detail) return undefined;

    previousFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.setTimeout(() => closeButtonRef.current?.focus(), 0);

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onCloseRef.current();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      previousFocusRef.current?.focus();
    };
  }, [detail]);

  return (
    <AnimatePresence>
      {detail && (
        <motion.div
          className="dialog-layer detail-layer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.section
            className="detail-overlay"
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            initial={shouldReduceMotion ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 34, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={shouldReduceMotion ? { opacity: 0, y: 0, scale: 1 } : { opacity: 0, y: 20, scale: 0.98 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            onClick={(event) => event.stopPropagation()}
          >
            <button ref={closeButtonRef} className="dialog-close" type="button" aria-label={closeLabel} onClick={onClose}>
              <X size={20} aria-hidden="true" />
            </button>
            <div className="detail-media">
              <img src={detail.image} alt={`${detail.title} Visual`} />
              <div className="detail-media-label">
                <span>{detail.eyebrow}</span>
                <strong>{label}</strong>
              </div>
            </div>
            <div className="detail-content">
              <p className="eyebrow dark">{detail.eyebrow}</p>
              <h2 id={titleId}>{detail.title}</h2>
              <p>{detail.intro}</p>
              <div className="detail-facts" aria-label="Fakten">
                {detail.facts.map((fact) => (
                  <span key={fact}>{fact}</span>
                ))}
              </div>
              <ul className="detail-benefits">
                {detail.benefits.map((benefit) => (
                  <li key={benefit}>
                    <Check size={17} aria-hidden="true" />
                    {benefit}
                  </li>
                ))}
              </ul>
              {onPrimaryAction && (
                <button className="button primary detail-book-button" type="button" onClick={() => onPrimaryAction(detail)}>
                  {primaryActionLabel}
                  <ArrowRight size={18} aria-hidden="true" />
                </button>
              )}
            </div>
          </motion.section>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
