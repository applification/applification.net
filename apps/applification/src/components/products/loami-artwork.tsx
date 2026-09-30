/* Native images keep the product artwork portable in Storybook. */
/* eslint-disable @next/next/no-img-element */
export function LoamiArtwork({ compact = false }: { compact?: boolean }) {
  return (
    <div
      className={`flex items-center justify-center ${compact ? "gap-3" : "gap-5"}`}
    >
      <img
        alt=""
        src={`/images/loami/${compact ? "loami-mark.svg" : "loami-3d-hello.png"}`}
        width={compact ? 96 : 320}
        height={compact ? 96 : 320}
        className={
          compact
            ? "size-20 object-contain"
            : "w-40 max-w-[45%] object-contain sm:w-56"
        }
      />
      <img
        alt="Loami"
        src="/images/loami/loami-wordmark-light.svg"
        width={680}
        height={263}
        className={compact ? "w-28 max-w-[50%]" : "w-44 max-w-[50%]"}
      />
    </div>
  );
}
