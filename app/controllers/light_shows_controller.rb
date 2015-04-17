class LightShowsController < ApplicationController
  def new
    @light_show = LightShow.new
    if current_user.light_shows.exists?
      light_shows = current_user.light_shows.order(:name)
      @light_show_dropdown = light_shows.map do |light_show|
        [light_show.name, light_show.id]
      end
      @light_effects_dropdown = current_user.light_effects.map do |light_effect|
        [light_effect.name, light_effect.id]
      end
      @lights_dropdown = [1, 2, 3].map do |light_effect|
        [light_effect, light_effect]
      end
      @light_sequences = light_shows.first.light_sequences.order(:scheduled_time)
      @light_show_first = light_shows.first
      @light_sequence = LightSequence.new
    end
  end

  def create
    @light_show = LightShow.new(light_show_params)
    @light_show.user = current_user
    if LightShow.exists?
      @light_show_dropdown = LightShow.order(:name).map do |light_show|
        [light_show.name, light_show.id]
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
