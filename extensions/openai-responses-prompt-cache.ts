import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import {
	type Context,
	type Model,
	type SimpleStreamOptions,
	streamSimpleOpenAIResponses,
} from "@earendil-works/pi-ai";

type ResponsesPayload = Record<string, unknown>;

function getPromptCacheKey(options?: SimpleStreamOptions): string | undefined {
	return options?.sessionId;
}

function addPromptCacheKey(payload: unknown, promptCacheKey: string | undefined): unknown {
	if (!promptCacheKey || !payload || typeof payload !== "object" || Array.isArray(payload)) {
		return payload;
	}

	const nextPayload: ResponsesPayload = { ...(payload as ResponsesPayload) };
	nextPayload.prompt_cache_key ??= promptCacheKey;
	return nextPayload;
}

export default function openAIResponsesPromptCache(pi: ExtensionAPI) {
	pi.registerProvider("openai", {
		api: "openai-responses",
		streamSimple(model: Model<"openai-responses">, context: Context, options?: SimpleStreamOptions) {
			const promptCacheKey = getPromptCacheKey(options);

			return streamSimpleOpenAIResponses(model, context, {
				...options,
				async onPayload(payload, payloadModel) {
					const hookPayload = await options?.onPayload?.(payload, payloadModel);
					return addPromptCacheKey(hookPayload ?? payload, promptCacheKey);
				},
			});
		},
	});
}
