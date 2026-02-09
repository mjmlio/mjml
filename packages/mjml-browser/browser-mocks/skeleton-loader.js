export default function loadSkeleton() {
  // In browser builds, do not resolve external skeleton paths.
  // Returning undefined leaves options.skeleton unchanged so defaults apply.
  return undefined
}
