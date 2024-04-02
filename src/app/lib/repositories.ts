export async function getRepositories(): Promise<Repository[]> {
	const response = await fetch('https://api.github.com/users/emilkrebs/repos');

	return await response.json();
}

export interface Repository {
	id: number;
	name: string;
	full_name: string;
	html_url: string;

	description: string;
	topics: string[];
	fork: boolean;

	created_at: string;
	updated_at: string;
	pushed_at: string;

	stargazers_count: number;

	language: string;
}