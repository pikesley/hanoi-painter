require 'yaml'

require 'twitter'
require 'mastodon'
require 'gitpaint'
require 'hanoi/jane'

@conf = YAML.load_file 'config/config.yaml'

task :default => [:paint]


desc 'do everything'
task :paint do
  Rake::Task['towers:render'].invoke

  puts 'sleeping for 10 seconds'
  sleep 10

  Rake::Task['social:transmit'].invoke
  Rake::Task['towers:move'].invoke
end

namespace :gitpaint do
  desc 'configure gitpaint'
  task :configure do 
    puts 'configuring Gitpaint'
    Gitpaint.configure do |config|
      config.username     = @conf['gitpaint']['username']
      config.email        = @conf['gitpaint']['email']
      config.repo         = @conf['gitpaint']['repo']
      config.scale_factor = @conf['gitpaint']['scale_factor']
      config.token        = @conf['gitpaint']['token']
      config.ssh_key      = @conf['gitpaint']['ssh_key']
    end
  end
end

namespace :towers do 
  desc 'deserialise the saved towers, or spawn a new set'
  task :retrieve do 
    puts 'retrieving towers'
    begin
      @towers = Hanoi::Jane::ConstrainedTowers.deserialise @conf['hanoi_jane']['save_path']
    rescue Errno::ENOENT => e
      if e.message == "No such file or directory @ rb_sysopen - #{@conf['hanoi_jane']['save_path']}"
        @towers = Hanoi::Jane::ConstrainedTowers.new @conf['hanoi_jane']['discs']
      end
    end
  end

  desc 'render the towers unto Github'
  task render: ['towers:retrieve', 'gitpaint:configure'] do 
    puts 'rendering towers to Github'
    h = Hanoi::Jane.render_to_github @towers
    Gitpaint.paint h, message: @towers.ternary
  end

  desc 'move and save' 
  task move: 'towers:retrieve' do
    puts 'moving and saving towers'
    @towers.move
    @towers.serialise @conf['hanoi_jane']['save_path']
  end
end

namespace :screenshot do 
  desc 'take a screenshot of the Github graph'
  task take: 'towers:retrieve' do 
    puts 'taking screenshots'
    filename = @towers.ternary
    `node snapper.js #{@conf['gitpaint']['username']} #{filename}`
    @image = File.open "screens/#{filename}.png"
  end
end

namespace :social do 
  namespace :twitter do 
    desc 'send to Twitter'
    task tweet: 'screenshot:take' do 
      puts 'sending to Twitter'
      twitter_client.update_with_media content(@towers), @image
    end

    desc 'delete all tweets'
    task :purge do
      client = twitter_client
      client.user_timeline.each do |t|
        id = t.id
        puts "Deleting Tweet #{id}"
        client.destroy_status id
      end
    end
  end

  namespace :mastodon do
    desc 'send to Mastodon'
    task toot: 'screenshot:take' do 
      puts 'sending to Mastodon'
      media = mastodon_client.upload_media @image
      mastodon_client.create_status content(@towers), nil, [media.id]
    end

    desc 'delete all toots'
    task :purge do
      client = mastodon_client
      client.statuses(@conf['mastodon']['account_id']).map do |s|
        id = s.id
        puts "Deleting Toot #{id}"
        client.destroy_status id
      end
    end
  end

  desc 'send everywhere' 
  task :transmit do 
    Rake::Task['social:twitter:tweet'].invoke
    Rake::Task['social:mastodon:toot'].invoke
  end

  desc 'purge everything'
  task :purge do
    Rake::Task['social:twitter:purge'].invoke
    Rake::Task['social:mastodon:purge'].invoke
  end
end

def twitter_client
  Twitter::REST::Client.new do |config|
    config.consumer_key        = @conf['twitter']['consumer_key']
    config.consumer_secret     = @conf['twitter']['consumer_secret']
    config.access_token        = @conf['twitter']['token']
    config.access_token_secret = @conf['twitter']['secret']
  end
end

def mastodon_client 
  Mastodon::REST::Client.new base_url:     @conf['mastodon']['base_url'],
                             bearer_token: @conf['mastodon']['token']
end

def content towers 
"""
#{@towers.ternary}

http://sam.pikesley.org/projects/hanoi-painter/
"""
end
