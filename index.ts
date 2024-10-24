import { serve } from "https://deno.land/std@0.119.0/http/server.ts";

function handlePreFlightRequest(): Response {
	return new Response("Preflight OK!", {
	  status: 200,
	  headers: {
		"Access-Control-Allow-Origin": "*",
		"Access-Control-Allow-Headers": "content-type",
	  },
	});
  }
  
  async function handler(_req: Request): Promise<Response> {
	if (_req.method == "OPTIONS") {
	  handlePreFlightRequest();
	}
  
	const headers = new Headers();
	headers.append("Content-Type", "application/json");

	const parser = _req.url.split("/");
	
	const similarityRequestBody = JSON.stringify({
	  word1: parser[parser.length - 1],
	  word2: "supelec",
	});
  
	const requestOptions = {
	  method: "POST",
	  headers: headers,
	  body: similarityRequestBody,
	  redirect: "follow",
	};
  
	try {
	  const response = await fetch("http://word2vec.nicolasfley.fr/similarity", requestOptions);
  
	  if (!response.ok) {
		console.error(`Error: ${response.statusText}`);
		return new Response(`Error: ${response.statusText}`, {
		  status: 200,
		  headers: {
			"Content-Type": "application/json",
			"Access-Control-Allow-Origin": "*",
			"Access-Control-Allow-Headers": "content-type",
		  },
		});
	  }
  
	  const result = parseFloat((await response.json()).result);

	  return new Response(JSON.stringify({value: 50 * (result + 1)}), {
		status: 200,
		headers: {
			"Content-Type": "application/json",
			"Access-Control-Allow-Origin": "*",
			"Access-Control-Allow-Headers": "content-type",
		},
		});
  
	  console.log(result);
	  return new Response(JSON.stringify(result), {
		status: 200,
		headers: {
		  "Content-Type": "application/json",
		  "Access-Control-Allow-Origin": "*",
		  "Access-Control-Allow-Headers": "content-type",
		},
	  });
	} catch (error) {
	  console.error("Fetch error:", error);
	  return new Response(`Error: ${error.message}`, { status: 500 });
	}
  }
  
  serve(handler);