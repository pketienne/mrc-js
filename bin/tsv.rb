class TSV
  attr_accessor :uri, :records

  def initialize(uri)
    @uri = uri
    # populate this labels variable with column names, to be used when writing new file version.
    @labels = []
    @records = []

    File.open(@uri).each do | record |
      @records.push(Record.new(record))
    end

    @records.shift
  end

  def line_number_first_labels
    @records.map { |r| r.line_number_first_label }
  end

  def line_number_last_labels
    @records.map { |r| r.line_number_last_label }
  end

  def populate_ordinates!(legend)
    @records.each do |r|
      r.line_number_first_ordinate = legend.translation.index(r.line_number_first_label)
      r.line_number_last_ordinate = legend.translation.index(r.line_number_last_label)
    end
  end
  
end
