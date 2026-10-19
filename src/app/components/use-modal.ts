"use client";

import { useEffect, type RefObject } from "react";

const FOCUSABLE =
    "a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex='-1'])";

/**
 * Modal behaviour shared by the site's dialogs: focus moves into the dialog,
 * Tab and Shift+Tab cycle inside it, Escape closes it, the page behind stops
 * scrolling, and focus returns to whatever opened it.
 */
export function useModal(open: boolean, setOpen: (open: boolean) => void, dialogRef: RefObject<HTMLElement | null>) {
    useEffect(() => {
        if (!open) return;

        const previouslyFocused = document.activeElement as HTMLElement | null;
        dialogRef.current?.focus();

        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setOpen(false);
                return;
            }
            const dialog = dialogRef.current;
            if (event.key !== "Tab" || !dialog) return;

            const focusable = [...dialog.querySelectorAll<HTMLElement>(FOCUSABLE)];
            if (focusable.length === 0) return;
            const first = focusable[0];
            const last = focusable[focusable.length - 1];
            const active = document.activeElement;
            const outside = !dialog.contains(active);

            if (event.shiftKey && (outside || active === first || active === dialog)) {
                event.preventDefault();
                last.focus();
            } else if (!event.shiftKey && (outside || active === last)) {
                event.preventDefault();
                first.focus();
            }
        };

        document.addEventListener("keydown", onKeyDown);
        document.documentElement.style.overflow = "hidden";

        return () => {
            document.removeEventListener("keydown", onKeyDown);
            document.documentElement.style.overflow = "";
            previouslyFocused?.focus();
        };
    }, [open, setOpen, dialogRef]);
}
