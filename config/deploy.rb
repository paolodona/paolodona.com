set :application, "paolodona.com"
set :repository,  "git@github.com:paolodona/paolodona.com.git"

set :branch, "master"
set :user, 'paolo'

set :deploy_to, "/apps/#{application}"
set :scm, :git

role :app, "173.45.224.41"
role :web, "173.45.224.41"

after :deploy, :regenerate_site

desc "regenerate site"
task :regenerate_site do
  run "cd #{current_path}; jekyll"
end 

namespace :deploy do
  task :restart do
    run ""# do nothing 
  end
end

