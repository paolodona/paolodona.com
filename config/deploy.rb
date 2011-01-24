default_run_options[:pty] = true
ssh_options[:compression] = false 

set :application, "paolodona.com"
set :repository,  "git@github.com:paolodona/paolodona.com.git"

set :branch, "master"
set :user, 'paolo'

set :deploy_to, "/apps/#{application}"
set :scm, :git

role :app, "paolodona.com"
role :web, "paolodona.com"

namespace :deploy do
  task :restart do
    run ""# do nothing 
  end
end

