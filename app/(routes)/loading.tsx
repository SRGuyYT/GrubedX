import { LoadingState } from "@/components/feedback/LoadingState";

export default function RoutesLoading() {
  return (
    <div className="page-shell py-12">
      <LoadingState title="Loading route" description="Streaming the next screen into place." />
    </div>
  );
}
