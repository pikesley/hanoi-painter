# Hanoi Painter

_Who among us hasn't wanted to play the Towers of Hanoi on the Github commit-history graph?_

![Graph](https://s2.gifyu.com/images/toh.gif)

**[Github](https://github.com/towers-of-hanoi) ::
[Twitter](https://twitter.com/hanoi_jane) ::
[Mastodon](https://mastodon.me.uk/@hanoi_jane)**

I made some changes to my [Hanoi Jane](http://sam.pikesley.org/projects/hanoi-jane/) gem:
* I added a [new formatter](https://github.com/pikesley/hanoi-jane/blob/master/lib/hanoi/jane/formatters/github.rb) which renders the output to a 52*7 grid, suitable for the Github graph
* I enabled [serialisation and deserialisation](https://github.com/pikesley/hanoi-jane/blob/master/spec/hanoi/jane/serialise_spec.rb) so it can be run as a cronjob or similar

I then built [Gitpaint](http://sam.pikesley.org/projects/gitpaint/), which allows you paint whatever 52*7, 5-grayscale data you want onto the Github graph

And then I brought it all together with this, orchestrated by Rake. The default Rake task will:

## Deserialise the saved Towers

Or spawn a new set if a save-file can't be found

## Render the output to Github

Which means:

* Deleting the existing repo from Github
* Making a new local repo
* Making the correct commits to draw the pixels (using the Github-formatted output from Hanoi Jane)
* Making a new Github repo
* Pushing the local repo [to Github](https://github.com/towers-of-hanoi)

## Sleep for 10 seconds

To allow Github time to refresh

## Take a screenshot

There's some [heavily cargo-culted Node](https://github.com/pikesley/hanoi-painter/blob/master/snapper.js) which takes the screenshots using Chromium

## Broadcast the screenshot

To [Twitter](https://twitter.com/hanoi_jane) and [Mastodon](https://mastodon.me.uk/@hanoi_jane), using the [Ternary values from Hanoi Jane](https://github.com/pikesley/hanoi-jane/blob/master/README.md#constrained-version) as the text

## Move and serialise the towers

Ready for the next run

# Configuration

This all requires quite a lot of configuration, as you might expect, which should go in `config/config.yaml`:

## Gitpaint

Needs:
* A Github `username` and `email`, so the commits will be credited and counted correctly (I'm doing this on a separate, dedicated Github account)
* The name of a (disposable) `repo` to work with: this will be created locally at `/tmp/#{repo}` and remotely at `https://github.com/#{github_user}/#{repo}` (and it will be mercilessly deleted from both places between runs)
* A Github [personal access token](https://github.com/settings/tokens) that has the `repo` privileges and, crucially, the separate `delete repo` privilege
* The path to an `ssh_key` that can commit to the `#{github_user}` account
* A `scale_factor`, by which each commit count will be multiplied
* A `project_url` which will be added to the social media transmissions

## Hanoi Jane

Needs:
* A `save_path`, for saving and loading the towers between runs
* A `discs` value (between 2 and 7)

## Twitter

Needs:
* A `consumer_key`, a `consumer_secret`, a `token` and a `secret` - see [Twurl](https://github.com/twitter/twurl/blob/master/README) for help on setting these up

## Mastodon

Needs:
* A `token`
* The `base_url` of your Mastodon instance
* Your `account_id` (which you can get by clicking on your `@name` from some places in the Mastodon UI)

(copy `config/config-example.yaml` to `config/config.yaml` and fill in as required)

# Timescale

It takes 2187 moves to solve the 7-disc Towers of Hanoi (3**7). EMF Camp 2020 is about 16600 hours away from now, 2018-10-06 (presuming it happens around the same time as this year's), and I want this to finish right in the middle of EMF. 16600 / 2187 is about 7.5, so I'm cronning this for three times a day and I'll review that schedule when the actual dates are announced
