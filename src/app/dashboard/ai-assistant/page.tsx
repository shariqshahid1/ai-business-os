import { PageHeader } from "@/components/dashboard/page-header";
import { AIChat } from "@/components/dashboard/ai-chat";

export default function AIAssistantPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="AI Assistant"
        description="Ask questions in plain language — powered by your live business data."
      />
      <AIChat />
    </div>
  );
}
