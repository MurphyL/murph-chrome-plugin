/**
 * 推荐清单
 */
const suggestConfig = {};

if(typeof(chrome.storage.local.get) === 'function') {
	chrome.storage.local.get([ 'savedConfig' ], ({ savedConfig }) => {
		console.log('配置文件', JSON.parse(savedConfig));
		JSON.parse(savedConfig).forEach(({ title, env }) => {
			for(let key in env) {
				if(!suggestConfig[key]) { 
					suggestConfig[key] = [];
				}
				if(typeof(env[key]) === 'object') {
					for(let item in env[key]) {
						let suffix = item ? '（' + item.toUpperCase() + '）' : '';
						suggestConfig[key].push({
							content: JSON.stringify({ env: key, url: env[key][item] }),
							description: `${title}${suffix} - ${key.toUpperCase()}环境`
						});
					}
				} else {
					suggestConfig[key].push({
						content: JSON.stringify({ env: key, url: env[key] }),
						description: `${title} - ${key.toUpperCase()}环境`
					});
				}
			}
		});
	});
}

chrome.omnibox.setDefaultSuggestion({
	description: '选择一个环境自动跳转'
});
 /***/

/**
 * 推荐
 */
chrome.omnibox.onInputChanged.addListener((text, suggest) => {
	let suggestItems = suggestConfig[text.toLowerCase()];
	if(!suggestItems) {
		suggestItems = [{
			description: 'Jira - 填写工时',
			content: JSON.stringify({
				url: 'http://jira.izhaogang.com/secure/deskAction!mainpage.jspa?tabId=7'
			})
		}, {
			description: 'Jira - 个人工作台',
			content: JSON.stringify({
				url: 'http://jira.izhaogang.com/secure/deskAction!mainpage.jspa'
			})
		}];
	}
	suggest(suggestItems);
});

/**
 * 跳转
 */
chrome.omnibox.onInputEntered.addListener((text) => {
	const { env, url } = JSON.parse(text);
	chrome.browserAction.setBadgeText({ 
		text: env ? env.toUpperCase() : ''
	});
	chrome.tabs.create({
		url,
		selected: true
	});
});
