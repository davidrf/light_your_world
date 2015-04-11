class LightShowsController < ApplicationController
  def new
    @light_show = LightShow.new
    if LightShow.exists?
      @light_show_dropdown = LightShow.order(:name).map do |ls|
        [ls.name, ls.id]
      end
    end
  end

  def create
    @light_show = LightShow.new(light_show_params)
    @light_show.user = current_user
    if LightShow.exists?
      @light_show_dropdown = LightShow.order(:name).map do |ls|
        [ls.name, ls.id]
      end
    end

    if @light_show.save
      flash[:notice] = 'Light Show Added!'
      redirect_to new_light_show_url
    else
      flash[:alert] = 'Light Show Was Not Saved.'
      render :new
    end
  end

  private

  def light_show_params
    params.require(:light_show).permit(:name)
  end
end
