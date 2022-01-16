import { clearLog, getLog } from './logCall';

/**
 * Setup the test environment
 * @returns {HTMLDivElement}
 */
export function setupScratch() {
	const scratch = document.createElement('div');
	scratch.id = 'scratch';
	(document.body || document.documentElement).appendChild(scratch);
	return scratch;
}

/**
 * Teardown test environment and reset preact's internal state
 * @param {HTMLDivElement} scratch
 */
export function teardown(scratch) {
	if (scratch) {
		scratch.parentNode.removeChild(scratch);
	}

	if (getLog().length > 0) {
		clearLog();
	}
}
