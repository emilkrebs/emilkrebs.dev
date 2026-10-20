"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useModal } from "./use-modal";
import { WECHAT_ID, WECHAT_QR_PATH } from "../lib/constants";
import type { WeChatCopy } from "../lib/i18n";

interface WeChatLinkProps {
    copy: WeChatCopy;
    className?: string;
}

/** WeChat has no profile URL: opens a dialog with the QR card instead. */
export function WeChatLink({ copy, className }: WeChatLinkProps) {
    const [open, setOpen] = useState(false);
    const dialogRef = useRef<HTMLDivElement>(null);

    useModal(open, setOpen, dialogRef);

    return (
        <>
            <button type="button" onClick={() => setOpen(true)} className={className}>
                {copy.label}
                <span className="text-signal" aria-hidden="true">→</span>
            </button>

            {/* Portaled to <body>: a stacking context around the trigger would otherwise bury it under the sticky nav. */}
            {open && createPortal(
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-6"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="wechat-title"
                >
                    <button
                        type="button"
                        aria-label={copy.closeAria}
                        onClick={() => setOpen(false)}
                        className="absolute inset-0 bg-paper-deep"
                    />
                    <div
                        ref={dialogRef}
                        tabIndex={-1}
                        className="relative w-full max-w-sm bg-paper border border-hairline p-6 md:p-8 focus:outline-none"
                    >
                        <div className="flex items-start justify-between gap-4">
                            <h2
                                id="wechat-title"
                                className="font-mono text-xs uppercase tracking-[0.08em] text-signal"
                            >
                                {copy.heading}
                            </h2>
                            <button
                                type="button"
                                onClick={() => setOpen(false)}
                                className="font-mono text-xs uppercase tracking-[0.08em] text-ink-soft hover:text-ink transition-colors duration-150"
                            >
                                {copy.close}
                            </button>
                        </div>

                        <Image
                            src={WECHAT_QR_PATH}
                            alt={copy.qrAlt}
                            width={832}
                            height={1210}
                            sizes="(min-width: 640px) 320px, 80vw"
                            className="mt-6 mx-auto h-auto w-auto max-h-[60vh] border border-hairline"
                        />

                        <p className="mt-6 font-mono text-xs uppercase tracking-[0.08em] text-ink-soft">
                            {copy.idLabel}: <span className="text-ink normal-case select-all">{WECHAT_ID}</span>
                        </p>
                    </div>
                </div>,
                document.body,
            )}
        </>
    );
}
