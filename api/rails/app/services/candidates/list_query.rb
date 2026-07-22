# frozen_string_literal: true

module Candidates
  class ListQuery
    DEFAULT_PAGE = 1
    DEFAULT_PER_PAGE = 20
    MAX_PER_PAGE = 100

    Result = Struct.new(:records, :page, :per_page, :total, :total_pages, keyword_init: true)

    def self.call(params)
      new(params).call
    end

    def initialize(params)
      @params = params
    end

    def call
      scope = Candidate.all
      scope = scope.by_status(@params[:status])
      scope = scope.search_name(@params[:q])
      scope = scope.sorted_by(@params[:sort], @params[:direction])

      page = [ @params[:page].to_i, DEFAULT_PAGE ].max
      page = DEFAULT_PAGE if @params[:page].blank?
      per_page = @params[:per_page].presence&.to_i || DEFAULT_PER_PAGE
      per_page = DEFAULT_PER_PAGE if per_page < 1
      per_page = [ per_page, MAX_PER_PAGE ].min

      total = scope.count
      total_pages = total.zero? ? 0 : (total.to_f / per_page).ceil
      records = scope.offset((page - 1) * per_page).limit(per_page)

      Result.new(
        records: records,
        page: page,
        per_page: per_page,
        total: total,
        total_pages: total_pages
      )
    end
  end
end
