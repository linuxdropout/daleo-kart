// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

if (!chrome.runtime.onInstalled) {
    chrome.runtime = {
        getURL: url => url,
    }
} else {
    chrome.runtime.onInstalled.addListener(() => {
        chrome.storage.sync.set({ color: '#3aa757' }, () => {
            // console.log('The color is red.');
        })

        chrome.declarativeContent.onPageChanged.removeRules(undefined, () => {
            chrome.declarativeContent.onPageChanged.addRules([{
                conditions: [new chrome.declarativeContent.PageStateMatcher({
                    pageUrl: { hostEquals: 'www.amazon.co.uk' },
                })],
                actions: [new chrome.declarativeContent.ShowPageAction()],
            }])
        })
    })
}
